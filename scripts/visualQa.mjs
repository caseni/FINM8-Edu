import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const allTracks = [
  'Temel Ekonomi',
  'Finansal Piyasalar',
  'Teknik Analiz',
  'Temel Analiz',
  'Risk ve Portföy',
  'Piyasa Psikolojisi',
  'Stratejiler',
  'Algoritmik Trade ve Quant',
  'SMC / ICT · İleri',
  'Varlık Okulları',
];
const representativeTracks = ['Teknik Analiz', 'Algoritmik Trade ve Quant', 'SMC / ICT · İleri'];
const beginnerMarketLessons = [
  'Bir fiyat nasıl ortaya çıkar',
  'Piyasada aldığın şey aslında nedir',
  'Neden bazen alıp satmak kolay, bazen zor',
  'Alış ve satış fiyatı neden farklı olabilir',
  'Emir verirken aslında ne seçiyorsun',
  'Ekrandaki fiyat neden işlem fiyatın olmayabilir',
];
const beginnerChartLessons = [
  'Grafikte gördüğün şey aslında nedir',
  'Aynı grafik neden yakınlaştırınca değişir',
  'Fiyat genel olarak hangi yöne gidiyor',
  'Fiyat neden bazı bölgelerde tekrar durur',
  'Hareket neden bazen hızlanır, bazen yavaşlar',
  'Grafikteki yardımcı çizgi geleceği bilir mi',
];
const diagnostics = [];

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function attachDiagnostics(page, label) {
  page.on('console', (message) => {
    const text = `[${label} console:${message.type()}] ${message.text()}`;
    console.log(text);
    if (message.type() === 'error') diagnostics.push(text);
  });
  page.on('pageerror', (error) => {
    const text = `[${label} pageerror] ${error.stack || error.message}`;
    console.log(text);
    diagnostics.push(text);
  });
  page.on('requestfailed', (request) => {
    const text = `[${label} requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`;
    console.log(text);
    diagnostics.push(text);
  });
  page.on('response', (response) => {
    if (response.status() >= 500) {
      const text = `[${label} response:${response.status()}] ${response.url()}`;
      console.log(text);
      diagnostics.push(text);
    }
  });
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  console.log(`${label}: viewport=${overflow.viewport}px page=${overflow.page}px`);
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${overflow.page}px > ${overflow.viewport}px`);
  }
}

async function openHome(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
}

async function openBeginnerSection(page, sectionName) {
  await openHome(page);
  await page.getByRole('button', { name: new RegExp(sectionName, 'i') }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
}

async function walkBeginnerLesson(page, lessonName, filePrefix) {
  await page.getByRole('button', { name: new RegExp(lessonName, 'i') }).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  if (!Number.isFinite(totalSteps) || totalSteps < 1) throw new Error(`Invalid beginner lesson step count for ${lessonName}.`);

  for (let step = 1; step <= totalSteps; step += 1) {
    await assertNoHorizontalOverflow(page, `${filePrefix}-step-${step}`);
    await page.screenshot({
      path: `visual-qa/${filePrefix}-step-${String(step).padStart(2, '0')}.png`,
      fullPage: true,
    });
    if (step < totalSteps) {
      await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
      await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
    }
  }
}

async function captureBeginnerFlow(page) {
  await openHome(page);
  await assertNoHorizontalOverflow(page, 'beginner-mobile-home');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-home.png', fullPage: true });

  await openBeginnerSection(page, 'Para ve Ekonomi');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-money-economy');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-money-economy.png', fullPage: true });
  await walkBeginnerLesson(page, 'Aynı para neden zamanla daha az şey alır', 'beginner-money-mobile');

  await openBeginnerSection(page, 'Piyasalar Nasıl Çalışır');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-markets');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-markets.png', fullPage: true });
  for (const lessonName of beginnerMarketLessons) {
    await openBeginnerSection(page, 'Piyasalar Nasıl Çalışır');
    await walkBeginnerLesson(page, lessonName, `beginner-markets-${slug(lessonName)}-mobile`);
  }

  await openBeginnerSection(page, 'Grafikleri Korkmadan Oku');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-charts');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-charts.png', fullPage: true });
  for (const lessonName of beginnerChartLessons) {
    await openBeginnerSection(page, 'Grafikleri Korkmadan Oku');
    await walkBeginnerLesson(page, lessonName, `beginner-charts-${slug(lessonName)}-mobile`);
  }
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
  const firstLessonName = after.find((name) => !before.has(name) && !/derslerini kapat$/i.test(name));
  if (!firstLessonName) throw new Error(`No lesson button became visible for ${trackTitle}`);
  return firstLessonName;
}

async function captureAdvancedLessonFlow(page, trackTitle) {
  const trackSlug = slug(trackTitle);
  await openAcademy(page);
  const firstLessonName = await openTrackAndFindFirstLesson(page, trackTitle);
  await assertNoHorizontalOverflow(page, `${trackSlug}-mobile-expanded`);
  await page.screenshot({ path: `visual-qa/${trackSlug}-mobile-expanded.png`, fullPage: true });
  await page.getByRole('button', { name: firstLessonName, exact: true }).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  for (let step = 1; step <= totalSteps; step += 1) {
    await assertNoHorizontalOverflow(page, `${trackSlug}-mobile-step-${step}`);
    if (step === 1 || step === totalSteps) {
      await page.screenshot({ path: `visual-qa/${trackSlug}-mobile-step-${String(step).padStart(2, '0')}.png`, fullPage: true });
    }
    if (step < totalSteps) {
      await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
      await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
    }
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attachDiagnostics(mobile, 'mobile');
  await captureBeginnerFlow(mobile);

  await openAcademy(mobile);
  await assertNoHorizontalOverflow(mobile, 'academy-mobile-collapsed');
  await mobile.screenshot({ path: 'visual-qa/academy-mobile-collapsed.png', fullPage: true });

  for (const trackTitle of allTracks) {
    const trackSlug = slug(trackTitle);
    const escaped = trackTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await mobile.getByRole('button', { name: new RegExp(`^${escaped} derslerini aç$`, 'i') }).click();
    await assertNoHorizontalOverflow(mobile, `academy-mobile-${trackSlug}-expanded`);
    await mobile.getByRole('button', { name: new RegExp(`^${escaped} derslerini kapat$`, 'i') }).click();
  }

  for (const trackTitle of representativeTracks) {
    await captureAdvancedLessonFlow(mobile, trackTitle);
  }

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  attachDiagnostics(desktop, 'desktop');
  await openHome(desktop);
  await assertNoHorizontalOverflow(desktop, 'beginner-desktop-home');
  await desktop.screenshot({ path: 'visual-qa/beginner-desktop-home.png', fullPage: true });

  for (const sectionName of ['Para ve Ekonomi', 'Piyasalar Nasıl Çalışır', 'Grafikleri Korkmadan Oku']) {
    await openBeginnerSection(desktop, sectionName);
    const sectionSlug = slug(sectionName);
    await assertNoHorizontalOverflow(desktop, `beginner-desktop-${sectionSlug}`);
    await desktop.screenshot({ path: `visual-qa/beginner-desktop-${sectionSlug}.png`, fullPage: true });
  }

  await openAcademy(desktop);
  await assertNoHorizontalOverflow(desktop, 'academy-desktop-collapsed');
  await desktop.screenshot({ path: 'visual-qa/academy-desktop-collapsed.png', fullPage: true });

  if (diagnostics.length > 0) {
    throw new Error(`Visual QA runtime diagnostics failed:\n${diagnostics.join('\n')}`);
  }
} finally {
  await browser.close();
}
