import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];

const lessons = [
  { key: 'candle', title: 'Grafikte gördüğün şey aslında nedir', maxHeightRatio: 0.72 },
  { key: 'timeframe', title: 'Aynı grafik neden yakınlaştırınca değişir', maxHeightRatio: 0.72 },
  { key: 'trend', title: 'Fiyat genel olarak hangi yöne gidiyor', maxHeightRatio: 0.72 },
];

async function openChartLesson(page, lessonTitle) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Grafikleri Korkmadan Oku/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(lessonTitle, 'i') }).click();
  await page.getByText(/Adım 1\//).waitFor();
}

async function largestVisibleImageBox(page) {
  const images = page.locator('[role="img"]');
  const count = await images.count();
  let largest;
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    if (!(await image.isVisible())) continue;
    const box = await image.boundingBox();
    if (!box) continue;
    if (!largest || box.width * box.height > largest.width * largest.height) largest = box;
  }
  return largest;
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (dimensions.page > dimensions.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${dimensions.page}px > ${dimensions.viewport}px`);
  }
}

async function boxFor(page, ariaLabel, label) {
  const node = page.locator(`[aria-label="${ariaLabel}"]`).first();
  await node.waitFor();
  const box = await node.boundingBox();
  if (!box) throw new Error(`${label}: ${ariaLabel} has no measurable box`);
  return box;
}

function assertInsideViewport(box, viewport, label) {
  if (box.x < -1 || box.x + box.width > viewport.width + 1) {
    throw new Error(`${label}: element escapes viewport`);
  }
}

async function assertPair(page, viewport, leftLabel, rightLabel, label, minMobile = 120, minDesktop = 180) {
  const left = await boxFor(page, leftLabel, label);
  const right = await boxFor(page, rightLabel, label);
  const minWidth = viewport.sizeClass === 'mobile' ? minMobile : minDesktop;
  for (const box of [left, right]) {
    if (box.width < minWidth) throw new Error(`${label}: comparison element too narrow at ${box.width.toFixed(1)}px`);
    assertInsideViewport(box, viewport, label);
  }
  if (Math.abs(left.y - right.y) > 8) throw new Error(`${label}: comparison elements must stay on one row`);
  if (right.x <= left.x + left.width) throw new Error(`${label}: comparison elements overlap`);
  return [left, right];
}

async function assertThreeAcross(page, viewport, labels, label) {
  const boxes = [];
  for (const ariaLabel of labels) boxes.push(await boxFor(page, ariaLabel, label));
  const minWidth = viewport.sizeClass === 'mobile' ? 70 : 145;
  for (const box of boxes) {
    if (box.width < minWidth) throw new Error(`${label}: three-way chart card too narrow at ${box.width.toFixed(1)}px`);
    assertInsideViewport(box, viewport, label);
  }
  if (Math.max(...boxes.map((box) => box.y)) - Math.min(...boxes.map((box) => box.y)) > 8) {
    throw new Error(`${label}: three-way chart comparison must stay on one row`);
  }
  for (let index = 1; index < boxes.length; index += 1) {
    if (boxes[index].x <= boxes[index - 1].x + boxes[index - 1].width) throw new Error(`${label}: three-way chart cards overlap`);
  }
}

async function assertCandleComposition(page, viewport, step, label) {
  if (step === 1) {
    const timeline = await boxFor(page, 'chart-candle-timeline', label);
    if (timeline.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: candle timeline is too compressed`);
  }
  if (step === 2) {
    const ohlc = await boxFor(page, 'chart-candle-ohlc', label);
    if (ohlc.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: OHLC study is too compressed`);
    for (const text of ['AÇILIŞ', 'KAPANIŞ', 'EN YÜKSEK', 'EN DÜŞÜK']) await page.getByText(text, { exact: true }).waitFor();
  }
  if (step === 3) {
    const prices = await boxFor(page, 'chart-candle-practice-prices', label);
    const candle = await boxFor(page, 'chart-candle-practice-candle', label);
    if (candle.x <= prices.x + prices.width) throw new Error(`${label}: OHLC practice candle overlaps price list`);
    if (prices.width < (viewport.sizeClass === 'mobile' ? 150 : 260)) throw new Error(`${label}: OHLC price list too narrow`);
  }
  if (step === 4) {
    await assertPair(page, viewport, 'chart-candle-finished', 'chart-candle-unknown', label);
  }
}

async function assertTimeframeComposition(page, viewport, step, label) {
  if (step === 1) await assertPair(page, viewport, 'chart-timeframe-close', 'chart-timeframe-broad', label);
  if (step === 2) {
    const aggregate = await boxFor(page, 'chart-timeframe-aggregate', label);
    if (aggregate.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: timeframe aggregation is too compressed`);
  }
  if (step === 3) await assertPair(page, viewport, 'chart-timeframe-practice-short', 'chart-timeframe-practice-long', label);
  if (step === 4) {
    const broad = await boxFor(page, 'chart-timeframe-bigger-picture', label);
    const zoom = await boxFor(page, 'chart-timeframe-zoom-window', label);
    if (zoom.width < (viewport.sizeClass === 'mobile' ? 110 : 180)) throw new Error(`${label}: zoom window is too narrow`);
    if (zoom.x < broad.x || zoom.x + zoom.width > broad.x + broad.width + 1) throw new Error(`${label}: zoom window must remain inside the bigger-picture width`);
  }
}

async function assertTrendComposition(page, viewport, step, label) {
  if (step === 1) {
    const single = await boxFor(page, 'chart-trend-single-candle', label);
    const structure = await boxFor(page, 'chart-trend-structure', label);
    if (single.width < (viewport.sizeClass === 'mobile' ? 80 : 100)) throw new Error(`${label}: single-candle comparison is too narrow`);
    if (structure.width < (viewport.sizeClass === 'mobile' ? 150 : 300)) throw new Error(`${label}: trend structure is too narrow`);
    if (structure.x <= single.x + single.width) throw new Error(`${label}: single candle overlaps trend structure`);
  }
  if (step === 2) await assertThreeAcross(page, viewport, ['chart-trend-rising', 'chart-trend-falling', 'chart-trend-sideways'], label);
  if (step === 3) {
    const structure = await boxFor(page, 'chart-trend-practice-structure', label);
    if (structure.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: trend practice structure is too compressed`);
  }
  if (step === 4) {
    const context = await boxFor(page, 'chart-trend-falling-context', label);
    const bounce = await boxFor(page, 'chart-trend-single-bounce', label);
    if (context.width < (viewport.sizeClass === 'mobile' ? 150 : 300)) throw new Error(`${label}: falling-trend context is too narrow`);
    if (bounce.width < (viewport.sizeClass === 'mobile' ? 80 : 100)) throw new Error(`${label}: bounce card is too narrow`);
    if (bounce.x <= context.x + context.width) throw new Error(`${label}: bounce card overlaps falling-trend context`);
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    for (const lesson of lessons) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const diagnostics = [];
      page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
      page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));

      await openChartLesson(page, lesson.title);
      const firstStepText = await page.getByText(/Adım 1\//).innerText();
      const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);

      for (let step = 1; step <= totalSteps; step += 1) {
        const label = `core-chart-${viewport.name}-${lesson.key}-step-${step}`;
        await assertNoHorizontalOverflow(page, label);
        const visual = await largestVisibleImageBox(page);
        if (!visual) throw new Error(`${label}: no visible chart teaching visual found`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: chart visual too small at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: chart visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: chart visual escapes viewport`);
        if (visual.height > viewport.height * lesson.maxHeightRatio) throw new Error(`${label}: chart visual consumes too much viewport height (${visual.height.toFixed(1)}px)`);

        if (lesson.key === 'candle') await assertCandleComposition(page, viewport, step, label);
        if (lesson.key === 'timeframe') await assertTimeframeComposition(page, viewport, step, label);
        if (lesson.key === 'trend') await assertTrendComposition(page, viewport, step, label);

        if (step === 2 || step === 3 || step === totalSteps) {
          await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        }

        if (step < totalSteps) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
        }
      }

      if (diagnostics.length) throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${totalSteps}/${totalSteps} core chart responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}
