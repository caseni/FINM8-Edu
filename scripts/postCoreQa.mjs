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
      },
    }));
  }, { key: progressKey, lessonIds: beginnerLessonIds });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
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

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await seedCompletedBeginnerPath(page);

  await page.getByText('24 / 24 TAMAMLANDI', { exact: true }).waitFor();
  if (await page.getByText('TAMAMLANDI', { exact: true }).count() < 4) {
    throw new Error('Expected all four beginner sections to show TAMAMLANDI.');
  }
  await assertNoHorizontalOverflow(page, 'post-core-home');
  await page.screenshot({ path: 'visual-qa/post-core-home.png', fullPage: true });

  await page.getByRole('button', { name: /Para ve Ekonomi/i }).first().click();
  await page.getByText('Bu bölümü tamamladın.', { exact: true }).waitFor();
  await page.getByText(/Sıradaki bölüm: Piyasalar Nasıl Çalışır/).waitFor();
  await page.getByRole('button', { name: 'Sıradaki bölüme geç' }).click();
  await page.getByText('Piyasalar Nasıl Çalışır?', { exact: true }).first().waitFor();
  await page.getByText('Bu bölümü tamamladın.', { exact: true }).waitFor();

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Riskten Korun/i }).first().click();
  await page.getByText('Temel yolun burada tamamlandı.', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'post-core-risk-complete');
  await page.screenshot({ path: 'visual-qa/post-core-risk-complete.png', fullPage: true });
  await page.getByRole('button', { name: 'İleri yolları gör' }).click();

  await page.getByText('Şimdi yalnız ilgini seç.', { exact: true }).waitFor();
  for (const option of [
    'Piyasaları daha iyi anla',
    'Grafikleri derinleştir',
    'Şirketleri anlamaya başla',
    'Risk ve portföyü güçlendir',
  ]) {
    await page.getByText(option, { exact: true }).waitFor();
  }
  await assertNoHorizontalOverflow(page, 'post-core-academy');
  await page.screenshot({ path: 'visual-qa/post-core-academy.png', fullPage: true });
} finally {
  await browser.close();
}
