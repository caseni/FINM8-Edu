import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const academyTrackTitles = [
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
const beginnerSectionTitle = 'Para ve Ekonomi';
const beginnerLessonTitle = 'Aynı para neden zamanla daha az şey alır';
const beginnerCorrectTaskAnswer = 'Paranın satın alma gücü azalmıştır';
const beginnerCorrectQuizOptionIndexes = [1, 0, 0];

async function buttonNames(page) {
  return page.getByRole('button').evaluateAll((buttons) =>
    buttons
      .map((button) => button.getAttribute('aria-label') || button.textContent || '')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

async function resetProgress(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate((key) => window.localStorage.removeItem(key), progressKey);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
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

async function assertPoliteFeedback(page, stage, allowedPrefixes) {
  const live = page.locator('[role="status"], [aria-live="polite"]');
  await live.last().waitFor();
  const target = live.last();
  const role = await target.getAttribute('role');
  const liveMode = await target.getAttribute('aria-live');
  const ariaLabel = (await target.getAttribute('aria-label'))?.trim();
  const visibleText = (await target.innerText()).replace(/\s+/g, ' ').trim();
  const label = ariaLabel || visibleText;
  if (role !== 'status' && liveMode !== 'polite') {
    throw new Error(`${stage}: feedback is not exposed as status/polite live region`);
  }
  if (!label || !allowedPrefixes.some((prefix) => label.startsWith(prefix))) {
    throw new Error(`${stage}: invalid live feedback label -> ${label || 'missing'}`);
  }
  return label;
}

async function solveCurrentTaskToQuiz(page, stage) {
  const initialCheck = page.getByRole('button', { name: 'Kontrol et', exact: true });
  await initialCheck.click();
  await assertPoliteFeedback(page, `${stage} initial feedback`, ['Doğru.', 'Henüz değil.']);
  const directContinue = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
  if (await directContinue.count()) {
    await directContinue.click();
    await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
    return;
  }

  const firstRetry = page.getByRole('button', { name: 'Tekrar dene', exact: true });
  if (!(await firstRetry.count())) throw new Error(`${stage}: task produced neither pass nor retry state`);
  await firstRetry.click();

  const choiceCount = await page.getByRole('checkbox').count();
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
    for (const choiceIndex of combo) {
      await choices.nth(choiceIndex).click();
    }
    await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
    await assertPoliteFeedback(page, `${stage} retry feedback`, ['Doğru.', 'Henüz değil.']);
    const continueButton = page.getByRole('button', { name: 'Quiz’e geç', exact: true });
    if (await continueButton.count()) {
      await continueButton.click();
      await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
      return;
    }
    const retryButton = page.getByRole('button', { name: 'Tekrar dene', exact: true });
    if (!(await retryButton.count())) throw new Error(`${stage}: task produced neither pass nor retry state`);
    await retryButton.click();
  }

  throw new Error(`${stage}: no task answer combination reached the quiz`);
}

async function solveBeginnerQuizToResult(page) {
  for (let questionIndex = 0; questionIndex < beginnerCorrectQuizOptionIndexes.length; questionIndex += 1) {
    const radios = page.getByRole('radio');
    const target = radios.nth(beginnerCorrectQuizOptionIndexes[questionIndex]);
    if ((await target.getAttribute('aria-checked')) !== 'true') {
      await target.click();
    }
    await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
    const actionLabel = questionIndex === beginnerCorrectQuizOptionIndexes.length - 1
      ? 'Sonucu gör'
      : 'Sonraki soru';
    await page.getByRole('button', { name: actionLabel, exact: true }).click();
  }

  const expectedResultLabel = `${beginnerLessonTitle}. Quiz tamamlandı. Skor yüzde 100. 3/3 doğru cevap.`;
  const resultSummary = page.locator(`[aria-live="polite"][aria-label="${expectedResultLabel}"]`);
  await resultSummary.waitFor();
  const actualLabel = await resultSummary.getAttribute('aria-label');
  if (actualLabel !== expectedResultLabel) {
    throw new Error(`Beginner quiz result aria-label mismatch -> expected "${expectedResultLabel}", got "${actualLabel ?? 'missing'}"`);
  }
}

async function openAcademyFirstLesson(page, academyTrackTitle) {
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

async function checkAcademyAssessmentAccessibility(page, academyTrackTitle) {
  const lessonName = await openAcademyFirstLesson(page, academyTrackTitle);
  await advanceLessonToTask(page);

  const taskStage = `${academyTrackTitle} Academy task`;
  const taskAnswers = await assertCleanAnswerLabels(page, 'checkbox', taskStage);
  await assertCheckedState(taskAnswers.nth(0), taskStage);
  await solveCurrentTaskToQuiz(page, taskStage);

  const quizStage = `${academyTrackTitle} Academy quiz`;
  const quizAnswers = await assertCleanAnswerLabels(page, 'radio', quizStage);
  await assertCheckedState(quizAnswers.nth(0), quizStage);
  await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
  await assertPoliteFeedback(page, `${quizStage} feedback`, ['Doğru.', 'Bu kez değil.']);
  console.log(`${academyTrackTitle} · ${lessonName}: checkbox task + radio quiz + live feedback accessibility PASS`);
}

async function checkBeginnerQuizAccessibility(page) {
  await resetProgress(page);
  await page.getByRole('button', { name: new RegExp(beginnerSectionTitle, 'i') }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(beginnerLessonTitle, 'i') }).click();
  await advanceLessonToTask(page);

  const taskAnswers = await assertCleanAnswerLabels(page, 'checkbox', 'Beginner task');
  const beginnerTaskAnswer = page.getByRole('checkbox', { name: beginnerCorrectTaskAnswer, exact: true });
  await beginnerTaskAnswer.waitFor();
  await assertCheckedState(beginnerTaskAnswer, 'Beginner task');
  if ((await taskAnswers.count()) < 2) throw new Error('Beginner task: insufficient semantic answer controls');
  await solveCurrentTaskToQuiz(page, 'Beginner task');

  const quizAnswers = await assertCleanAnswerLabels(page, 'radio', 'Beginner quiz');
  await assertCheckedState(quizAnswers.nth(0), 'Beginner quiz');
  await solveBeginnerQuizToResult(page);
  console.log(`${beginnerLessonTitle}: Beginner checkbox task + radio quiz + live result accessibility PASS`);
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

  for (const academyTrackTitle of academyTrackTitles) {
    await checkAcademyAssessmentAccessibility(page, academyTrackTitle);
  }
  await checkBeginnerQuizAccessibility(page);

  if (diagnostics.length > 0) {
    throw new Error(`Assessment accessibility diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Assessment accessibility: 10 Academy schools + Beginner tasks/quizzes + live feedback/result PASS');
} finally {
  await browser.close();
}
