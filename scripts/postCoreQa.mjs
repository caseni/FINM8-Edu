import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const beginnerLessonIds = [
  'lesson.economy.inflation.001',
  'lesson.economy.interest-rates.001',
  'lesson.economy.central-banks.001',
  'lesson.economy.monetary-policy.001',
  'lesson.economy.growth.001',
  'lesson.economy.business-cycle.001',
  'lesson.market.price-formation.001',
  'lesson.market.instruments.001',
  'lesson.market.liquidity.001',
  'lesson.market.bid-ask.001',
  'lesson.market.order-types.001',
  'lesson.market.slippage.001',
  'lesson.chart.candles.001',
  'lesson.chart.timeframes.001',
  'lesson.chart.trend.001',
  'lesson.chart.support-resistance.001',
  'lesson.technical.momentum.001',
  'lesson.technical.moving-average.001',
  'lesson.risk.uncertainty.001',
  'lesson.risk.volatility.001',
  'lesson.risk.position-sizing.001',
  'lesson.risk.reward.001',
  'lesson.risk.stop-orders.001',
  'lesson.portfolio.diversification.001',
];
const academyFoundationPaths = [
  {
    key: 'market',
    trackTitle: 'Piyasaları Anla',
    starterLabel: /^Piyasaları daha iyi anla:/i,
    lessons: [
      'Borsa ne işe yarar?',
      'Endeks neyi gösterir?',
      'Tek işlemle bir sepete nasıl yatırım yapılır?',
      'Tahvil nedir, fiyatı neden değişebilir?',
      'Döviz kuru aslında neyi karşılaştırır?',
      'Altın, petrol ve buğday neden aynı grupta?',
    ],
  },
  {
    key: 'technical',
    trackTitle: 'Grafikleri Derinleştir',
    starterLabel: /^Grafikleri derinleştir:/i,
    lessons: [
      'Fiyat bir seviyeyi aşınca neye bakmalısın?',
      'Fiyat seviyeyi aşıp geri dönerse ne olmuş olabilir?',
      'Kısa geri çekilme trendin bittiğini gösterir mi?',
      'Fiyat neden bazen iki sınır arasında gidip gelir?',
      'Hareket neden bazen hızlanır, bazen yavaşlar?',
      'Grafikteki yardımcı çizgi geleceği bilir mi?',
    ],
  },
  {
    key: 'fundamental',
    trackTitle: 'Şirketleri Anla',
    starterLabel: /^Şirketleri anlamaya başla:/i,
    lessons: [
      'Bir şirketi anlamak için neden tek sayı yetmez?',
      'Satış artarken kâr neden düşebilir?',
      'Şirketin sahip oldukları ve borçları neden birlikte okunur?',
      'Kâr eden şirketin kasası neden boşalabilir?',
      '100 liralık satıştan şirkete ne kadar kalıyor?',
      'Şirketin borcu ne zaman tehlikeli hale gelir?',
    ],
  },
  {
    key: 'risk',
    trackTitle: 'Risk ve Portföy',
    starterLabel: /^Risk ve portföyü güçlendir:/i,
    lessons: [
      'İki yatırım hep birlikte hareket ediyorsa gerçekten farklı mı?',
      'Portföy yol boyunca ne kadar düşmüş olabilir?',
      'Aynı fiyat hareketi kaldıraçla neden daha sert hissedilir?',
      'Çok yatırım yapmak neden her zaman riski dağıtmaz?',
      'Parayı eşit bölmek riski de eşit böler mi?',
      'Portföy kurarken ilk soru ne olmalı?',
    ],
  },
];

async function seedCompletedBeginnerPath(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(({ key, lessonIds }) => {
    const existing = window.localStorage.getItem(key);
    const persisted = existing ? JSON.parse(existing) : { state: {}, version: 0 };
    window.localStorage.setItem(key, JSON.stringify({
      ...persisted,
      version: persisted.version ?? 0,
      state: {
        ...(persisted.state ?? {}),
        completedLessonIds: lessonIds,
        lessonCheckpoints: {
          'lesson.markets.exchanges.001': {
            lessonId: 'lesson.markets.exchanges.001',
            stage: 'lesson',
            stepIndex: 0,
            updatedAt: '2026-08-20T05:00:00.000Z',
          },
        },
      },
    }));
  }, { key: progressKey, lessonIds: beginnerLessonIds });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('learn-home-screen').waitFor();
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

async function openCompletedAcademy(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'İleri öğrenme yoluna geç' }).waitFor();
  await page.getByRole('button', { name: 'İleri öğrenme yoluna geç' }).click();
  await page.getByTestId('academy-home-screen').waitFor();
}

async function openAcademyFoundation(page, path) {
  await openCompletedAcademy(page);
  await page.getByRole('button', { name: path.starterLabel }).first().click();
  const expandedTrack = page.getByRole('button', { name: `${path.trackTitle} derslerini kapat` });
  await expandedTrack.waitFor();
  await page.waitForTimeout(250);
  const expandedTrackBox = await expandedTrack.boundingBox();
  if (!expandedTrackBox || expandedTrackBox.y < 0 || expandedTrackBox.y >= 844) {
    throw new Error(`Starter direction did not bring ${path.trackTitle} into the mobile viewport.`);
  }
  await page.getByText('ÖNCE BUNLARLA BAŞLA', { exact: true }).waitFor();
  await page.getByText('SONRA DERİNLEŞ', { exact: true }).waitFor();
}

async function walkAcademyFoundationLesson(page, path, lessonName, lessonIndex) {
  await openAcademyFoundation(page, path);
  const escapedLessonName = lessonName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.getByRole('button', { name: new RegExp(`^${escapedLessonName}(?:$| ·)`, 'i') }).click();
  await page.getByText(/Adım 1\//).waitFor();
  const stepMatch = (await page.getByText(/Adım 1\//).innerText()).match(/\/(\d+)/);
  const totalSteps = Number(stepMatch?.[1] ?? 1);
  if (!Number.isFinite(totalSteps) || totalSteps < 1) {
    throw new Error(`Invalid Academy ${path.key} lesson step count for ${lessonName}.`);
  }

  for (let step = 1; step <= totalSteps; step += 1) {
    await assertNoHorizontalOverflow(page, `academy-${path.key}-${lessonIndex}-step-${step}`);
    await page.screenshot({
      path: `visual-qa/academy-${path.key}-foundation-${String(lessonIndex).padStart(2, '0')}-step-${String(step).padStart(2, '0')}.png`,
      fullPage: true,
    });
    if (step < totalSteps) {
      await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
      await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
    }
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await seedCompletedBeginnerPath(page);

  await page.getByRole('button', { name: 'İleri öğrenme yoluna geç' }).waitFor();
  if (await page.getByText('TAMAMLANDI', { exact: true }).count() < 4) {
    throw new Error('Expected all four beginner sections to show TAMAMLANDI.');
  }
  await assertNoHorizontalOverflow(page, 'post-core-home');
  await page.screenshot({ path: 'visual-qa/post-core-home.png', fullPage: true });

  await page.getByRole('button', { name: /Para ve Ekonomi/i }).first().click();
  await page.getByText('Bu bölümü tamamladın.', { exact: true }).waitFor();
  await page.getByText(/Sıradaki bölüm: Piyasalar Nasıl Çalışır/).waitFor();
  await page.getByRole('button', { name: /^Sıradaki bölüme geç:/i }).click();
  await page.getByRole('button', { name: /Bir fiyat nasıl ortaya çıkar/i }).waitFor();
  await page.getByText('Bu bölümü tamamladın.', { exact: true }).waitFor();

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Riskten Korun/i }).first().click();
  await page.getByText('Temel yolun burada tamamlandı.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'post-core-risk-complete');
  await page.screenshot({ path: 'visual-qa/post-core-risk-complete.png', fullPage: true });
  await page.getByRole('button', { name: 'İleri öğrenme yollarını gör' }).click();

  await page.getByTestId('academy-home-screen').waitFor();
  for (const option of [
    'Piyasaları daha iyi anla',
    'Grafikleri derinleştir',
    'Şirketleri anlamaya başla',
    'Risk ve portföyü güçlendir',
  ]) {
    await page.getByText(option, { exact: true }).waitFor();
  }
  await assertNoHorizontalOverflow(page, 'post-core-academy');
  const academyResume = page.getByRole('button', { name: /Derse devam et: Borsa ne işe yarar\? · Piyasaları Anla/i });
  await academyResume.waitFor();
  await page.screenshot({ path: 'visual-qa/post-core-academy.png', fullPage: true });
  await academyResume.click();
  await page.getByText(/Adım 1\//).waitFor();

  for (const path of academyFoundationPaths) {
    await openAcademyFoundation(page, path);
    await assertNoHorizontalOverflow(page, `academy-${path.key}-layered`);
    await page.screenshot({ path: `visual-qa/academy-${path.key}-layered.png`, fullPage: true });
    for (let index = 0; index < path.lessons.length; index += 1) {
      await walkAcademyFoundationLesson(page, path, path.lessons[index], index + 1);
    }
  }
} finally {
  await browser.close();
}
