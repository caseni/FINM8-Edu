import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const trackTitle = 'Piyasaları Anla';

async function buttonNames(page) {
  return page.getByRole('button').evaluateAll((buttons) =>
    buttons
      .map((button) => button.getAttribute('aria-label') || button.textContent || '')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

async function openFirstLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();

  const before = new Set(await buttonNames(page));
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).click();
  await page.waitForTimeout(150);
  const after = await buttonNames(page);
  const nextActionPattern = /^(Derse başla|Derse devam et|Göreve devam et|Quiz’e devam et):/i;
  const lessonName = after.find((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (!lessonName) throw new Error(`No first lesson found for ${trackTitle}`);
  await page.getByRole('button', { name: lessonName, exact: true }).click();
  return lessonName;
}

async function advanceToTask(page) {
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

async function markedAnswerButtons(page) {
  const buttons = page.getByRole('button');
  const result = [];
  const count = await buttons.count();
  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index);
    const visible = (await button.innerText()).trim();
    if (/^[○●✓×]\s+\S/.test(visible)) result.push(button);
  }
  return result;
}

async function assertCleanAnswerLabels(page, stage) {
  const answers = await markedAnswerButtons(page);
  if (answers.length < 2) throw new Error(`${stage}: fewer than two answer controls found`);

  for (const answer of answers) {
    const visible = (await answer.innerText()).trim();
    const expectedLabel = visible.replace(/^[○●✓×]\s+/, '').trim();
    const actualLabel = (await answer.getAttribute('aria-label'))?.trim();
    if (!actualLabel) throw new Error(`${stage}: answer is missing aria-label -> ${visible}`);
    if (/^[○●✓×]/.test(actualLabel)) {
      throw new Error(`${stage}: visual state marker leaked into aria-label -> ${actualLabel}`);
    }
    if (actualLabel !== expectedLabel) {
      throw new Error(`${stage}: aria-label mismatch -> expected "${expectedLabel}", got "${actualLabel}"`);
    }
  }

  return answers;
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

  const lessonName = await openFirstLesson(page);
  await advanceToTask(page);

  const taskAnswers = await assertCleanAnswerLabels(page, 'task');
  await taskAnswers[0].click();
  const taskSelected = await taskAnswers[0].getAttribute('aria-selected');
  if (taskSelected !== 'true') {
    throw new Error(`task: selected answer did not expose aria-selected=true (got ${taskSelected})`);
  }
  await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
  const quizButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
  await quizButton.waitFor();
  await quizButton.click();
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();

  const quizAnswers = await assertCleanAnswerLabels(page, 'quiz');
  await quizAnswers[0].click();
  const quizSelected = await quizAnswers[0].getAttribute('aria-selected');
  if (quizSelected !== 'true') {
    throw new Error(`quiz: selected answer did not expose aria-selected=true (got ${quizSelected})`);
  }

  if (diagnostics.length > 0) {
    throw new Error(`Assessment accessibility diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log(`${lessonName}: task + quiz accessibility labels/state PASS`);
} finally {
  await browser.close();
}
