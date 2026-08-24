import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const root = process.cwd();

const tracks = [
  ['Ekonomiyi Anla', ['economyFoundationsLessons.ts', 'economyExpansionLessons.ts']],
  ['Piyasaları Anla', ['financialMarketsFoundationLessons.ts', 'financialMarketsExpansionLessons.ts']],
  ['Grafikleri Derinleştir', ['technicalAnalysisFoundationLessons.ts', 'technicalAnalysisExpansionLessons.ts']],
  ['Şirketleri Anla', ['fundamentalAnalysisFoundationLessons.ts', 'fundamentalAnalysisExpansionLessons.ts']],
  ['Risk ve Portföy', ['riskPortfolioFoundationLessons.ts', 'riskPortfolioExpansionLessons.ts']],
  ['Karar Psikolojisi', ['marketPsychologyFoundationLessons.ts', 'marketPsychologyExpansionLessons.ts']],
  ['Yöntemler ve Planlar', ['strategyFoundationLessons.ts', 'strategyExpansionLessons.ts']],
  ['Sistematik ve Sayısal Yaklaşımlar', ['algoQuantFoundationLessons.ts', 'algoQuantExpansionLessons.ts']],
  ['İleri Grafik Yaklaşımları', ['smcIctFoundationLessons.ts', 'smcIctExpansionLessons.ts']],
  ['Varlık Türlerini Anla', ['assetSchoolFoundationLessons.ts', 'assetSchoolExpansionLessons.ts']],
].map(([title, files]) => ({
  title,
  files: files.map((file) => `src/domain/learning/examples/academy/${file}`),
}));

function lessonIds(files) {
  const ids = [];
  for (const relativePath of files) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    const regex = /\bid:\s*['"](lesson\.[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(source))) ids.push(match[1]);
  }
  return Array.from(new Set(ids));
}

function slug(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
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

async function solveTask(page, stage) {
  const choiceCount = await page.getByRole('checkbox').count();
  if (choiceCount < 2 || choiceCount > 6) {
    throw new Error(`${stage}: unexpected task choice count ${choiceCount}`);
  }

  const combinations = [];
  for (let mask = 1; mask < (1 << choiceCount); mask += 1) {
    const indexes = [];
    for (let index = 0; index < choiceCount; index += 1) {
      if ((mask & (1 << index)) !== 0) indexes.push(index);
    }
    combinations.push(indexes);
  }
  combinations.sort((a, b) => a.length - b.length);

  for (const combo of combinations) {
    const choices = page.getByRole('checkbox');
    for (const choiceIndex of combo) await choices.nth(choiceIndex).click();
    await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
    const continueButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
    if (await continueButton.count()) {
      await continueButton.click();
      await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
      return;
    }
    const retry = page.getByRole('button', { name: 'Tekrar dene', exact: true });
    if (!(await retry.count())) throw new Error(`${stage}: task produced neither pass nor retry`);
    await retry.click();
  }
  throw new Error(`${stage}: no task answer combination passed`);
}

async function selectedRadioLabel(page) {
  const radios = page.getByRole('radio');
  const count = await radios.count();
  for (let index = 0; index < count; index += 1) {
    if (await radios.nth(index).getAttribute('aria-checked') === 'true') {
      return (await radios.nth(index).getAttribute('aria-label'))?.trim();
    }
  }
  return undefined;
}

async function completeQuizPassed(page, stage) {
  let knownCorrect = [];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const learnedCorrect = [];
    for (let question = 1; question <= 3; question += 1) {
      await page.getByText(`${question}/3`, { exact: true }).waitFor();
      const radios = page.getByRole('radio');
      const optionCount = await radios.count();
      if (optionCount < 2) throw new Error(`${stage}: question ${question} has too few options`);

      if (knownCorrect[question - 1]) {
        await page.getByRole('radio', { name: knownCorrect[question - 1], exact: true }).click();
      } else {
        await radios.nth(0).click();
      }

      await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
      const correct = (await page.getByText('✓ Doğru', { exact: true }).count()) > 0;
      if (correct) {
        const label = await selectedRadioLabel(page);
        if (!label) throw new Error(`${stage}: correct answer has no selected radio label`);
        learnedCorrect[question - 1] = label;
      } else {
        const feedback = await page.getByText(/✓ Doğru cevap:/).innerText();
        learnedCorrect[question - 1] = feedback.replace(/^✓\s*Doğru cevap:\s*/, '').trim();
      }

      await page.getByRole('button', { name: question === 3 ? 'Sonucu gör' : 'Sonraki soru', exact: true }).click();
    }

    const passed =
      (await page.getByText('Quiz tamamlandı', { exact: true }).count()) > 0 ||
      (await page.getByText('Okulu tamamladın', { exact: true }).count()) > 0;
    if (passed) return;

    if (attempt === 0) {
      knownCorrect = learnedCorrect;
      if (knownCorrect.length !== 3 || knownCorrect.some((label) => !label)) {
        throw new Error(`${stage}: could not learn all correct quiz answers`);
      }
      await page.getByRole('button', { name: 'Quiz’i tekrar dene', exact: true }).click();
      await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
      continue;
    }

    throw new Error(`${stage}: quiz did not pass after replaying learned correct answers`);
  }
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${overflow.page}px > ${overflow.viewport}px`);
  }
}

async function waitForVisibleExactText(page, text, stage, timeoutMs = 10000) {
  const matches = page.getByText(text, { exact: true });
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const count = await matches.count();
    for (let index = 0; index < count; index += 1) {
      const candidate = matches.nth(index);
      if (await candidate.isVisible()) return candidate;
    }
    await page.waitForTimeout(100);
  }
  throw new Error(`${stage}: no visible exact text "${text}"`);
}

for (const track of tracks) {
  const ids = lessonIds(track.files);
  if (ids.length !== 12) throw new Error(`${track.title}: expected 12 lessons, found ${ids.length}`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => {
    if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
  });

  for (const track of tracks) {
    const ids = lessonIds(track.files);
    const firstEleven = ids.slice(0, -1);
    await seedProgress(page, firstEleven);
    await openAcademy(page);
    await page.getByRole('button', { name: new RegExp(`^${track.title} derslerini aç$`, 'i') }).click();

    const startLastLesson = page.getByRole('button', { name: /^Derse başla:/i });
    await startLastLesson.waitFor();
    await startLastLesson.click();
    await advanceLessonToTask(page);
    await solveTask(page, `${track.title} final lesson`);
    await completeQuizPassed(page, `${track.title} final lesson`);

    await waitForVisibleExactText(page, 'OKUL TAMAMLANDI', `${track.title} final result`);
    await page.getByText('Okulu tamamladın', { exact: true }).waitFor();
    await page.getByText(`${track.title} · 12/12 ders`, { exact: true }).waitFor();
    await page.getByText(/Bu okulun 12 dersini tamamladın/i).waitFor();
    await assertNoHorizontalOverflow(page, `academy-final-result-${slug(track.title)}`);

    if (await page.getByRole('button', { name: 'Sıradaki derse geç', exact: true }).count()) {
      throw new Error(`${track.title}: final lesson incorrectly offers a next lesson`);
    }
    const academyReturn = page.getByRole('button', { name: 'Academy’ye dön', exact: true });
    await academyReturn.waitFor();

    if (track.title === 'Piyasaları Anla') {
      await page.screenshot({ path: 'visual-qa/academy-final-lesson-result.png', fullPage: true });
    }

    await academyReturn.click();

    await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
    const completedTrackButton = page.getByRole('button', { name: new RegExp(`^${track.title} derslerini kapat$`, 'i') });
    await completedTrackButton.waitFor();
    await completedTrackButton.getByText('12/12 ders', { exact: true }).waitFor();
    await completedTrackButton.getByText('TAMAMLANDI', { exact: true }).waitFor();
    await waitForVisibleExactText(page, 'OKUL TAMAMLANDI', `${track.title} Academy completion card`);
    await assertNoHorizontalOverflow(page, `academy-final-${slug(track.title)}`);

    if (track.title === 'Piyasaları Anla') {
      await page.screenshot({ path: 'visual-qa/academy-final-lesson-complete.png', fullPage: true });
    }
    console.log(`${track.title}: lesson 12 -> school-complete result -> Academy -> 12/12 TAMAMLANDI PASS`);
  }

  if (diagnostics.length > 0) {
    throw new Error(`Academy final-lesson diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Academy final lesson: all ten schools PASS');
} finally {
  await browser.close();
}
