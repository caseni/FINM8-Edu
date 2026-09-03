import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const tracks = [
  'Ekonomiyi Anla',
  'Piyasaları Anla',
  'Grafikleri Derinleştir',
  'Şirketleri Anla',
  'Risk ve Portföy',
  'Karar Psikolojisi',
  'Yöntemler ve Planlar',
  'Sistematik ve Sayısal Yaklaşımlar',
  'İleri Grafik Yaklaşımları',
  'Varlık Türlerini Anla',
];
const diagnostics = [];

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function attachDiagnostics(page) {
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => {
    if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
  });
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${overflow.page}px > ${overflow.viewport}px`);
  }
}

async function openHome(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByTestId('learn-home-screen').waitFor({ timeout: 10000 });
}

async function openAcademy(page) {
  await openHome(page);
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
}

async function buttonNames(page) {
  return page.getByRole('button').evaluateAll((buttons) =>
    buttons
      .map((button) => button.getAttribute('aria-label') || button.textContent || '')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

async function openTrackAndFindFirstLesson(page, trackTitle) {
  const before = new Set(await buttonNames(page));
  const escaped = escapeRegExp(trackTitle);
  await page.getByRole('button', { name: new RegExp(`^${escaped} derslerini aç$`, 'i') }).click();
  await page.waitForTimeout(150);
  const after = await buttonNames(page);
  const nextActionPattern = /^(Derse başla|Derse devam et|Göreve devam et|Quiz’e devam et):/i;
  const firstLessonName = after.find((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (!firstLessonName) throw new Error(`No first lesson found for ${trackTitle}`);
  return firstLessonName;
}

async function advanceLessonToTask(page, lessonName, prefix) {
  await page.getByRole('button', { name: lessonName, exact: true }).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  if (!Number.isFinite(totalSteps) || totalSteps < 1) throw new Error(`Invalid step count for ${lessonName}`);
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: 'Göreve geç', exact: true }).click();
  await page.getByText('GÖREV · 2/3', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-task-entry`);
  await page.screenshot({ path: `visual-qa/${prefix}-task-entry.png`, fullPage: true });
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

async function waitForTaskSelection(page) {
  await page.waitForFunction(() => {
    const check = [...document.querySelectorAll('button')].find(
      (button) => button.getAttribute('aria-label') === 'Kontrol et'
    );
    return Boolean(check) && check.disabled === false;
  });
}

async function solveTask(page, prefix) {
  const choiceCount = await page.getByRole('checkbox').count();
  if (choiceCount < 2 || choiceCount > 6) {
    throw new Error(`${prefix}: unexpected task choice count ${choiceCount}`);
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

  for (let attempt = 0; attempt < combinations.length; attempt += 1) {
    const combo = combinations[attempt];
    await waitForTaskReady(page, choiceCount);
    const choices = page.getByRole('checkbox');
    console.log(`${prefix}: task attempt ${attempt + 1}/${combinations.length} choices=${combo.join(',')}`);
    for (const choiceIndex of combo) {
      await choices.nth(choiceIndex).click();
    }
    await waitForTaskSelection(page);
    const checkButton = page.getByRole('button', { name: 'Kontrol et', exact: true });
    await checkButton.click();
    const continueButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
    if (await continueButton.count()) {
      await assertNoHorizontalOverflow(page, `${prefix}-task-correct`);
      await page.screenshot({ path: `visual-qa/${prefix}-task-correct.png`, fullPage: true });
      await continueButton.click();
      await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
      return;
    }
    const retryButton = page.getByRole('button', { name: 'Tekrar dene', exact: true });
    if (!(await retryButton.count())) {
      throw new Error(`${prefix}: task produced neither pass nor retry state`);
    }
    await retryButton.click();
  }

  throw new Error(`${prefix}: no task choice combination passed`);
}

async function completeQuiz(page, prefix, firstLessonName) {
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
  for (let question = 1; question <= 3; question += 1) {
    await page.getByText(`${question}/3`, { exact: true }).waitFor();
    const options = page.getByRole('radio');
    const optionCount = await options.count();
    if (optionCount < 2) throw new Error(`${prefix}: question ${question} has too few options`);
    await options.nth(0).click();
    await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
    await page.getByText(/✓ Doğru|× Senin seçimin:/).waitFor();
    await assertNoHorizontalOverflow(page, `${prefix}-quiz-${question}`);
    if (question === 1) {
      await page.screenshot({ path: `visual-qa/${prefix}-quiz-feedback.png`, fullPage: true });
    }
    await page.getByRole('button', { name: question === 3 ? 'Sonucu gör' : 'Sonraki soru', exact: true }).click();
  }

  await page.getByText(/Quiz tamamlandı|Kısa bir tekrar iyi olur/, { exact: true }).waitFor();
  const passed = (await page.getByText('Quiz tamamlandı', { exact: true }).count()) > 0;
  await assertNoHorizontalOverflow(page, `${prefix}-result`);
  await page.screenshot({ path: `visual-qa/${prefix}-result.png`, fullPage: true });

  if (passed) {
    const nextLesson = page.getByRole('button', { name: 'Sıradaki derse geç', exact: true });
    const academyReturn = page.getByRole('button', { name: 'Academy’ye dön', exact: true });
    if (!(await nextLesson.count()) || !(await academyReturn.count())) {
      throw new Error(`${prefix}: passed Academy quiz is missing next-lesson or Academy-return action`);
    }
    await nextLesson.click();
    await page.getByText(/Adım 1\//).waitFor();
    await assertNoHorizontalOverflow(page, `${prefix}-next-lesson`);
    await page.screenshot({ path: `visual-qa/${prefix}-next-lesson.png`, fullPage: true });
    await page.getByRole('button', { name: 'Dersten çık', exact: true }).click();
  } else {
    const academyReturn = page.getByRole('button', { name: 'Academy’ye dön', exact: true });
    if (!(await academyReturn.count())) throw new Error(`${prefix}: failed Academy quiz has no Academy return action`);
    await academyReturn.click();
  }

  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-academy-return`);

  if (passed) {
    const nextAction = page.getByRole('button', { name: /^Derse devam et:/i });
    if (!(await nextAction.count())) throw new Error(`${prefix}: direct next lesson did not preserve its lesson checkpoint`);
    const nextName = await nextAction.first().getAttribute('aria-label');
    if (nextName?.includes(firstLessonName)) throw new Error(`${prefix}: passed quiz still points to completed first lesson`);
  } else {
    const resume = page.getByRole('button', {
      name: new RegExp(`^Quiz’e devam et: ${escapeRegExp(firstLessonName)}$`, 'i'),
    });
    if (!(await resume.count())) throw new Error(`${prefix}: failed quiz did not preserve quiz resume checkpoint`);
  }

  await page.screenshot({ path: `visual-qa/${prefix}-academy-return.png`, fullPage: true });
  return passed;
}

async function runTrackJourney(page, trackTitle) {
  const prefix = `academy-e2e-${slug(trackTitle)}`;
  await openAcademy(page);
  const firstLessonName = await openTrackAndFindFirstLesson(page, trackTitle);
  await advanceLessonToTask(page, firstLessonName, prefix);
  await solveTask(page, prefix);
  const passed = await completeQuiz(page, prefix, firstLessonName);
  console.log(`${trackTitle}: lesson -> task -> quiz -> result -> Academy PASS (${passed ? 'quiz passed -> next lesson' : 'quiz failed -> resume preserved'})`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attachDiagnostics(page);
  for (const trackTitle of tracks) {
    await runTrackJourney(page, trackTitle);
  }
  if (diagnostics.length > 0) {
    throw new Error(`Academy journey runtime diagnostics:\n${diagnostics.join('\n')}`);
  }
} finally {
  await browser.close();
}
