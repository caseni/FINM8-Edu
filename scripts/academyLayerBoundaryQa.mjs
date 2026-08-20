import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const root = process.cwd();
const foundationFile = 'src/domain/learning/examples/academy/financialMarketsFoundationLessons.ts';

function lessonIds(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const ids = [];
  const regex = /\bid:\s*['"](lesson\.[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(source))) ids.push(match[1]);
  return Array.from(new Set(ids));
}

async function seedProgress(page, completedLessonIds) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(({ key, completed }) => {
    window.localStorage.setItem(key, JSON.stringify({
      version: 0,
      state: { completedLessonIds: completed },
    }));
  }, { key: progressKey, completed: completedLessonIds });
  await page.reload({ waitUntil: 'networkidle' });
}

async function openAcademy(page) {
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
}

async function advanceLessonToTask(page) {
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: 'Göreve geç', exact: true }).click();
  await page.getByText('GÖREV · 2/3', { exact: true }).waitFor();
}

async function waitForTaskReady(page, expectedChoiceCount) {
  await page.waitForFunction((count) => {
    const choices = [...document.querySelectorAll('[role="checkbox"]')];
    const check = [...document.querySelectorAll('button')].find(
      (button) => button.getAttribute('aria-label') === 'Kontrol et'
    );
    return choices.length === count
      && choices.every((choice) => choice.getAttribute('aria-disabled') !== 'true')
      && Boolean(check)
      && check.disabled === true;
  }, expectedChoiceCount);
}

async function solveTask(page) {
  const choiceCount = await page.getByRole('checkbox').count();
  if (choiceCount < 2 || choiceCount > 6) throw new Error(`Unexpected task choice count ${choiceCount}`);
  const combinations = [];
  for (let mask = 1; mask < (1 << choiceCount); mask += 1) {
    const combo = [];
    for (let index = 0; index < choiceCount; index += 1) if ((mask & (1 << index)) !== 0) combo.push(index);
    combinations.push(combo);
  }
  combinations.sort((a, b) => a.length - b.length);

  for (const combo of combinations) {
    await waitForTaskReady(page, choiceCount);
    const choices = page.getByRole('checkbox');
    for (const index of combo) await choices.nth(index).click();
    await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
    const continueButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
    if (await continueButton.count()) {
      await continueButton.click();
      await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
      return;
    }
    const retry = page.getByRole('button', { name: 'Tekrar dene', exact: true });
    if (!(await retry.count())) throw new Error('Task produced neither pass nor retry');
    await retry.click();
  }
  throw new Error('No task answer combination passed');
}

async function selectedRadioLabel(page) {
  const radios = page.getByRole('radio');
  for (let index = 0; index < await radios.count(); index += 1) {
    if (await radios.nth(index).getAttribute('aria-checked') === 'true') {
      return (await radios.nth(index).getAttribute('aria-label'))?.trim();
    }
  }
  return undefined;
}

async function completeQuizPassed(page) {
  let knownCorrect = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const learnedCorrect = [];
    for (let question = 1; question <= 3; question += 1) {
      await page.getByText(`${question}/3`, { exact: true }).waitFor();
      const radios = page.getByRole('radio');
      if (knownCorrect[question - 1]) await page.getByRole('radio', { name: knownCorrect[question - 1], exact: true }).click();
      else await radios.nth(0).click();
      await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
      if (await page.getByText('✓ Doğru', { exact: true }).count()) {
        learnedCorrect[question - 1] = await selectedRadioLabel(page);
      } else {
        const feedback = await page.getByText(/✓ Doğru cevap:/).innerText();
        learnedCorrect[question - 1] = feedback.replace(/^✓\s*Doğru cevap:\s*/, '').trim();
      }
      await page.getByRole('button', { name: question === 3 ? 'Sonucu gör' : 'Sonraki soru', exact: true }).click();
    }
    if (await page.getByText('Quiz tamamlandı', { exact: true }).count()) return;
    knownCorrect = learnedCorrect;
    await page.getByRole('button', { name: 'Quiz’i tekrar dene', exact: true }).click();
    await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
  }
  throw new Error('Foundation boundary quiz did not pass');
}

const ids = lessonIds(foundationFile);
if (ids.length !== 6) throw new Error(`Expected 6 financial markets foundation lessons, found ${ids.length}`);

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => { if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`); });

  await seedProgress(page, ids.slice(0, 5));
  await openAcademy(page);
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).click();
  const startSixth = page.getByRole('button', { name: /^Derse başla:/i });
  await startSixth.waitFor();
  await startSixth.click();
  await advanceLessonToTask(page);
  await solveTask(page);
  await completeQuizPassed(page);

  await page.getByText(/Bu okulun temel 6 dersini tamamladın/).waitFor();
  if (await page.getByRole('button', { name: 'Sıradaki derse geç', exact: true }).count()) {
    throw new Error('Lesson 6 must not auto-continue into the optional deeper layer');
  }
  const academyReturn = page.getByRole('button', { name: 'Academy’ye dön', exact: true });
  await academyReturn.waitFor();
  await academyReturn.click();

  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  const expanded = page.getByRole('button', { name: /^Piyasaları Anla derslerini kapat$/i });
  await expanded.waitFor();
  await expanded.getByText('6/12 ders', { exact: true }).waitFor();
  await expanded.getByText('50%', { exact: true }).waitFor();
  await page.getByText('SONRA DERİNLEŞ', { exact: true }).waitFor();
  await page.getByText('Hazır olduğunda daha teknik ayrıntılara geç. Bu bölüm zorunlu değil.', { exact: true }).waitFor();
  await page.getByRole('button', { name: /^Derse başla:/i }).waitFor();
  await page.screenshot({ path: 'visual-qa/academy-foundation-layer-complete.png', fullPage: true });

  const overflow = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  if (overflow.page > overflow.viewport + 1) throw new Error(`Academy foundation layer overflow ${overflow.page}px > ${overflow.viewport}px`);
  if (diagnostics.length) throw new Error(`Academy foundation layer diagnostics:\n${diagnostics.join('\n')}`);
  console.log('Academy 6/12 foundation boundary PASS');
} finally {
  await browser.close();
}
