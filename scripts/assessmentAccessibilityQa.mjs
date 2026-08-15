import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const academyTrackTitle = 'Piyasaları Anla';
const beginnerSectionTitle = 'Para ve Ekonomi';
const beginnerLessonTitle = 'Aynı para neden zamanla daha az şey alır';
const beginnerCorrectTaskAnswer = 'Paranın satın alma gücü azalmıştır';

async function buttonNames(page) {
  return page.getByRole('button').evaluateAll((buttons) =>
    buttons
      .map((button) => button.getAttribute('aria-label') || button.textContent || '')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

async function advanceLessonToTask(page) {
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  if (!Number.isFinite(totalSteps) || totalSteps < 1) throw new Error('Invalid lesson step count');
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: 'Göreve geç', exact: true }).click();
  await page.getByText('GÖREV · 2/3', { exact: true }).waitFor();
}

async function assertCleanAnswerLabels(page, role, stage) {
  const answers = page.getByRole(role);
  const count = await answers.count();
  if (count < 2) throw new Error(`${stage}: fewer than two ${role} answer controls found`);

  for (let index = 0; index < count; index += 1) {
    const answer = answers.nth(index);
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
    const checked = await answer.getAttribute('aria-checked');
    if (checked !== 'false') {
      throw new Error(`${stage}: unselected ${role} should expose aria-checked=false (got ${checked})`);
    }
  }

  return answers;
}

async function assertCheckedState(answer, stage) {
  await answer.click();
  const checked = await answer.getAttribute('aria-checked');
  if (checked !== 'true') {
    throw new Error(`${stage}: selected answer did not expose aria-checked=true (got ${checked})`);
  }
}

async function openAcademyFirstLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();

  const before = new Set(await buttonNames(page));
  await page.getByRole('button', { name: new RegExp(`^${academyTrackTitle} derslerini aç$`, 'i') }).click();
  await page.waitForTimeout(150);
  const after = await buttonNames(page);
  const nextActionPattern = /^(Derse başla|Derse devam et|Göreve devam et|Quiz’e devam et):/i;
  const lessonName = after.find((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (!lessonName) throw new Error(`No first lesson found for ${academyTrackTitle}`);
  await page.getByRole('button', { name: lessonName, exact: true }).click();
  return lessonName;
}

async function checkAcademyAssessmentAccessibility(page) {
  const lessonName = await openAcademyFirstLesson(page);
  await advanceLessonToTask(page);

  const taskAnswers = await assertCleanAnswerLabels(page, 'checkbox', 'Academy task');
  await assertCheckedState(taskAnswers.nth(0), 'Academy task');
  await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
  const quizButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
  await quizButton.waitFor();
  await quizButton.click();
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();

  const quizAnswers = await assertCleanAnswerLabels(page, 'radio', 'Academy quiz');
  await assertCheckedState(quizAnswers.nth(0), 'Academy quiz');
  console.log(`${lessonName}: Academy checkbox task + radio quiz accessibility PASS`);
}

async function checkBeginnerQuizAccessibility(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: new RegExp(beginnerSectionTitle, 'i') }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(beginnerLessonTitle, 'i') }).click();
  await advanceLessonToTask(page);

  const taskAnswers = await assertCleanAnswerLabels(page, 'checkbox', 'Beginner task');
  const beginnerTaskAnswer = page.getByRole('checkbox', { name: beginnerCorrectTaskAnswer, exact: true });
  await beginnerTaskAnswer.waitFor();
  await assertCheckedState(beginnerTaskAnswer, 'Beginner task');
  if ((await taskAnswers.count()) < 2) throw new Error('Beginner task: insufficient semantic answer controls');
  await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
  const quizButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
  await quizButton.waitFor();
  await quizButton.click();
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();

  const quizAnswers = await assertCleanAnswerLabels(page, 'radio', 'Beginner quiz');
  await assertCheckedState(quizAnswers.nth(0), 'Beginner quiz');
  console.log(`${beginnerLessonTitle}: Beginner checkbox task + radio quiz accessibility PASS`);
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

  await checkAcademyAssessmentAccessibility(page);
  await checkBeginnerQuizAccessibility(page);

  if (diagnostics.length > 0) {
    throw new Error(`Assessment accessibility diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Assessment accessibility: checkbox tasks + radio Academy/Beginner quizzes PASS');
} finally {
  await browser.close();
}
