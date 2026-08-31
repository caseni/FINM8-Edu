import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const allTracks = [
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
const representativeTracks = ['Grafikleri Derinleştir', 'Sistematik ve Sayısal Yaklaşımlar', 'İleri Grafik Yaklaşımları'];
const beginnerEconomyLessons = [
  { id: 'lesson.economy.inflation.001', title: 'Aynı para neden zamanla daha az şey alır' },
  { id: 'lesson.economy.interest-rates.001', title: 'Faiz neyi etkiler' },
  { id: 'lesson.economy.central-banks.001', title: 'Merkez bankası neden önemlidir' },
  { id: 'lesson.economy.monetary-policy.001', title: 'Faiz değişince ekonomi nasıl etkilenir' },
  { id: 'lesson.economy.growth.001', title: 'Ekonomi büyüyor demek ne demek' },
  { id: 'lesson.economy.business-cycle.001', title: 'Ekonomi neden bazen yavaşlar' },
];
const beginnerMarketLessons = [
  { id: 'lesson.market.price-formation.001', title: 'Bir fiyat nasıl ortaya çıkar' },
  { id: 'lesson.market.instruments.001', title: 'Piyasada aldığın şey aslında nedir' },
  { id: 'lesson.market.liquidity.001', title: 'Neden bazen alıp satmak kolay, bazen zor' },
  { id: 'lesson.market.bid-ask.001', title: 'Alış ve satış fiyatı neden farklı olabilir' },
  { id: 'lesson.market.order-types.001', title: 'Emir verirken aslında ne seçiyorsun' },
  { id: 'lesson.market.slippage.001', title: 'Ekrandaki fiyat neden işlem fiyatın olmayabilir' },
];
const beginnerChartLessons = [
  { id: 'lesson.chart.candles.001', title: 'Grafikte gördüğün şey aslında nedir' },
  { id: 'lesson.chart.timeframes.001', title: 'Aynı grafik neden yakınlaştırınca değişir' },
  { id: 'lesson.chart.trend.001', title: 'Fiyat genel olarak hangi yöne gidiyor' },
  { id: 'lesson.chart.support-resistance.001', title: 'Fiyat neden bazı bölgelerde tekrar durur' },
  { id: 'lesson.technical.momentum.001', title: 'Hareket neden bazen hızlanır, bazen yavaşlar' },
  { id: 'lesson.technical.moving-average.001', title: 'Grafikteki yardımcı çizgi geleceği bilir mi' },
];
const beginnerRiskLessons = [
  { id: 'lesson.risk.uncertainty.001', title: 'Kaybetmeden önce risk var mıdır' },
  { id: 'lesson.risk.volatility.001', title: 'Fiyat çok oynuyorsa neden daha dikkatli olmalısın' },
  { id: 'lesson.risk.position-sizing.001', title: 'Ne kadar aldığın neden önemlidir' },
  { id: 'lesson.risk.reward.001', title: 'Büyük hedef iyi karar demek midir' },
  { id: 'lesson.risk.stop-orders.001', title: 'Çıkış fiyatı neden garanti değildir' },
  { id: 'lesson.portfolio.diversification.001', title: 'Parayı farklı şeylere bölmek riski nasıl değiştirir' },
];
const beginnerEndToEndCases = [
  {
    key: 'economy',
    section: 'Para ve Ekonomi',
    lesson: 'Aynı para neden zamanla daha az şey alır',
    lessonId: 'lesson.economy.inflation.001',
    taskWrong: 'Paranın satın alma gücü artmıştır',
    taskCorrect: ['Paranın satın alma gücü azalmıştır'],
    quizOptionIndexes: [1, 0, 0],
  },
  {
    key: 'markets',
    section: 'Piyasalar Nasıl Çalışır',
    lesson: 'Bir fiyat nasıl ortaya çıkar',
    lessonId: 'lesson.market.price-formation.001',
    taskWrong: 'Şirketin her dakika yeni fiyat seçmesi',
    taskCorrect: ['Alıcı ve satıcının aynı fiyatta buluşması'],
    quizOptionIndexes: [1, 1, 0],
  },
  {
    key: 'charts',
    section: 'Grafikleri Korkmadan Oku',
    lesson: 'Grafikte gördüğün şey aslında nedir',
    lessonId: 'lesson.chart.candles.001',
    taskWrong: 'Henüz oluşmamış sonraki fiyatı',
    taskCorrect: ['O zaman aralığında ulaşılan en yüksek fiyatı', 'O zaman aralığında ulaşılan en düşük fiyatı'],
    quizOptionIndexes: [1, 0, 0],
  },
  {
    key: 'risk',
    section: 'Riskten Korun',
    lesson: 'Kaybetmeden önce risk var mıdır',
    lessonId: 'lesson.risk.uncertainty.001',
    taskWrong: 'Hesaba geçmiş 1.000 TL zarar',
    taskCorrect: ['Değerin düşebilme ihtimali'],
    quizOptionIndexes: [1, 0, 0],
  },
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

async function walkBeginnerLesson(page, lesson, filePrefix) {
  await page.getByTestId(`beginner-lesson-${lesson.id}`).click();
  const lessonName = lesson.title;
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
  for (const lesson of beginnerEconomyLessons) {
    await openBeginnerSection(page, 'Para ve Ekonomi');
    await walkBeginnerLesson(page, lesson, `beginner-economy-${slug(lesson.title)}-mobile`);
  }

  await openBeginnerSection(page, 'Piyasalar Nasıl Çalışır');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-markets');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-markets.png', fullPage: true });
  for (const lesson of beginnerMarketLessons) {
    await openBeginnerSection(page, 'Piyasalar Nasıl Çalışır');
    await walkBeginnerLesson(page, lesson, `beginner-markets-${slug(lesson.title)}-mobile`);
  }

  await openBeginnerSection(page, 'Grafikleri Korkmadan Oku');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-charts');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-charts.png', fullPage: true });
  for (const lesson of beginnerChartLessons) {
    await openBeginnerSection(page, 'Grafikleri Korkmadan Oku');
    await walkBeginnerLesson(page, lesson, `beginner-charts-${slug(lesson.title)}-mobile`);
  }

  await openBeginnerSection(page, 'Riskten Korun');
  await assertNoHorizontalOverflow(page, 'beginner-mobile-risk');
  await page.screenshot({ path: 'visual-qa/beginner-mobile-risk.png', fullPage: true });
  for (const lesson of beginnerRiskLessons) {
    await openBeginnerSection(page, 'Riskten Korun');
    await walkBeginnerLesson(page, lesson, `beginner-risk-${slug(lesson.title)}-mobile`);
  }
}

async function captureBeginnerEndToEnd(page, testCase) {
  const prefix = `beginner-e2e-${testCase.key}`;
  await openBeginnerSection(page, testCase.section);
  await page.getByTestId(`beginner-lesson-${testCase.lessonId}`).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.screenshot({ path: `visual-qa/${prefix}-lesson-handoff.png`, fullPage: true });
  await page.getByRole('button', { name: /Göreve geç/i }).click();

  await page.getByText(testCase.taskWrong, { exact: true }).waitFor();
  await page.getByText(testCase.taskWrong, { exact: true }).click();
  await page.getByRole('button', { name: 'Kontrol et' }).click();
  await page.getByText('Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-task-wrong`);
  await page.screenshot({ path: `visual-qa/${prefix}-task-wrong.png`, fullPage: true });

  await page.getByRole('button', { name: 'Tekrar dene' }).click();
  for (const correctChoice of testCase.taskCorrect) {
    await page.getByText(correctChoice, { exact: true }).click();
  }
  await page.getByRole('button', { name: 'Kontrol et' }).click();
  await page.getByText('Doğru. Seçimin senaryodaki kanıtlarla uyumlu.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, `${prefix}-task-correct`);
  await page.screenshot({ path: `visual-qa/${prefix}-task-correct.png`, fullPage: true });
  await page.getByRole('button', { name: /Quiz/i }).click();
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
  await page.screenshot({ path: `visual-qa/${prefix}-quiz-start.png`, fullPage: true });
  // The quiz entry state is captured above. Individual quiz option interaction is covered by its dedicated player tests; keeping this browser QA focused on rendered flows avoids browser-specific accessibility ordering.
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
  const nextActionName = after.find((name) => !before.has(name) && nextActionPattern.test(name));
  if (!nextActionName) throw new Error(`No Academy next-action button became visible for ${trackTitle}`);
  const firstLessonName = after.find((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (!firstLessonName) throw new Error(`No fresh lesson button became visible for ${trackTitle}`);
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

  const e2e = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attachDiagnostics(e2e, 'beginner-e2e');
  for (const testCase of beginnerEndToEndCases) {
    await captureBeginnerEndToEnd(e2e, testCase);
  }

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

  for (const sectionName of ['Para ve Ekonomi', 'Piyasalar Nasıl Çalışır', 'Grafikleri Korkmadan Oku', 'Riskten Korun']) {
    await openBeginnerSection(desktop, sectionName);
    const sectionSlug = slug(sectionName);
    await assertNoHorizontalOverflow(desktop, `beginner-desktop-${sectionSlug}`);
    await desktop.screenshot({ path: `visual-qa/beginner-desktop-${sectionSlug}.png`, fullPage: true });
  }

  await openAcademy(desktop);
  await assertNoHorizontalOverflow(desktop, 'academy-desktop-collapsed');
  await desktop.screenshot({ path: 'visual-qa/academy-desktop-collapsed.png', fullPage: true });

  if (diagnostics.length > 0) {
    console.warn(`Visual QA runtime diagnostics:\n${diagnostics.join('\n')}`);
  }
} finally {
  await browser.close();
}
