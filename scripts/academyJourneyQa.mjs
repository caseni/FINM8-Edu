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

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

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
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
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
  const escaped = trackTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

async function advanceLessonToTask(page, lessonName) {
  await page.getByRole('button', { name: lessonName, exact: true }).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  if (!Number.isFinite(totalSteps) || totalSteps < 1) throw new Error(`Invalid step count for ${lessonName}`);
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: /Göreve geç/i }).click();
  await page.getByText(/SENARYO GÖREVİ|GRAFİK GÖREVİ/).waitFor();
}

async function taskChoiceNames(page) {
  const excluded = /^(Öğrenme akışından çık|Kontrol et|Tekrar dene|Quiz’e geç)$/i;
  return (await buttonNames(page)).filter((name) => !excluded.test(name));
}

async function solveTask(page, prefix) {
  const names = await taskChoiceNames(page);
  if (names.length < 2 || names.length > 6) {
    throw new Error(`${prefix}: unexpected task choice count ${names.length}: ${names.join(' | ')}`);
  }

  const combinations = [];
  for (let mask = 1; mask < (1 << names.length); mask += 1) {
    combinations.push(names.filter((_, index) => (mask & (1 << index)) !== 0));
  }
  combinations.sort((a, b) => a.length - b.length);

  for (const combo of combinations) {
    for (const choice of combo) {
      await page.getByRole('button', { name: choice, exact: true }).click();
    }
    await page.getByRole('button', { name: 'Kontrol et', exact: true }).click();
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

async function quizOptionNames(page) {
  const excluded = /^(Öğrenme akışından çık|Cevabı kontrol et|Sonraki soru|Sonucu gör)$/i;
  return (await buttonNames(page)).filter((name) => !excluded.test(name));
}

async function completeQuiz(page, prefix) {
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
  for (let question = 1; question <= 3; question += 1) {
    await page.getByText(`${question}/3`, { exact: true }).waitFor();
    const options = await quizOptionNames(page);
    if (options.length < 2) throw new Error(`${prefix}: question ${question} has too few options`);
    await page.getByRole('button', { name: options[0], exact: true }).click();
    await page.getByRole('button', { name: 'Cevabı kontrol et', exact: true }).click();
    await page.getByText(/✓ Doğru|× Senin seçimin:/).waitFor();
    await assertNoHorizontalOverflow(page, `${prefix}-quiz-${question}`);
    if (question === 1) {
      await page.screenshot({ path: `visual-qa/${prefix}-quiz-feedback.png`, fullPage: true });
    }
    await page.getByRole('button', { name: question === 3 ? 'Sonucu gör' : 'Sonraki soru', exact: true }).click();
  }

  await page.getByText(/Quiz tamamlandı|Kısa bir tekrar iyi olur/, { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-result`);
  await page.screenshot({ path: `visual-qa/${prefix}-result.png`, fullPage: true });

  const passReturn = page.getByRole('button', { name: 'Öğrenme alanına dön', exact: true });
  const failReturn = page.getByRole('button', { name: 'Öğrenme yoluna dön', exact: true });
  if (await passReturn.count()) await passReturn.click();
  else if (await failReturn.count()) await failReturn.click();
  else throw new Error(`${prefix}: result screen has no learning return action`);

  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-academy-return`);
}

async function runTrackJourney(page, trackTitle) {
  const prefix = `academy-e2e-${slug(trackTitle)}`;
  await openAcademy(page);
  const firstLessonName = await openTrackAndFindFirstLesson(page, trackTitle);
  await advanceLessonToTask(page, firstLessonName);
  await assertNoHorizontalOverflow(page, `${prefix}-task`);
  await solveTask(page, prefix);
  await completeQuiz(page, prefix);
  console.log(`${trackTitle}: lesson -> task -> quiz -> result -> Academy PASS`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const trackTitle of tracks) {
    await runTrackJourney(page, trackTitle);
  }
} finally {
  await browser.close();
}
