import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [{ name: 'mobile-360', width: 360, height: 800, minVisualWidth: 220 }, { name: 'mobile-390', width: 390, height: 844, minVisualWidth: 240 }, { name: 'desktop', width: 1440, height: 900, minVisualWidth: 300 }];
const lessons = [{ key: 'candle', title: 'Grafikte gördüğün şey aslında nedir' }, { key: 'timeframe', title: 'Aynı grafik neden yakınlaştırınca değişir' }, { key: 'trend', title: 'Fiyat genel olarak hangi yöne gidiyor' }];
const legacySelectors = ['[aria-label="chart-candle-ohlc"]','[aria-label="chart-candle-practice-prices"]','[aria-label="chart-timeframe-close"]','[aria-label="chart-timeframe-broad"]','[aria-label="chart-trend-rising"]','[aria-label="chart-trend-falling"]','[aria-label="chart-trend-sideways"]'];

async function openLesson(page, title) { await page.goto(baseUrl, { waitUntil: 'networkidle' }); await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 }); await page.getByRole('button', { name: /Grafikleri Korkmadan Oku/i }).first().click(); await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor(); await page.getByRole('button', { name: new RegExp(title, 'i') }).click(); await page.getByText(/Adım 1\//).waitFor(); }

async function largestImageLocator(page) {
  const images = page.locator('[role="img"]');
  let largest;
  let largestLocator;
  for (let i = 0; i < await images.count(); i += 1) {
    const image = images.nth(i);
    if (!(await image.isVisible())) continue;
    const box = await image.boundingBox();
    if (box && (!largest || box.width * box.height > largest.width * largest.height)) {
      largest = box;
      largestLocator = image;
    }
  }
  return { locator: largestLocator, box: largest };
}

async function noOverflow(page, label) { const d = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth })); if (d.page > d.viewport + 1) throw new Error(`${label}: horizontal overflow ${d.page}px > ${d.viewport}px`); }
function assertLandscape(box, label) { const ratio = box.width / box.height; if (ratio < 1.47 || ratio > 1.53) throw new Error(`${label}: chart artwork distorted at ${ratio.toFixed(2)}:1; expected 3:2`); }

// Every role in this lesson group is a planned physical asset (see
// docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json), so the largest teaching visual on
// every step must be backed by a real decoded raster <img>, never the
// pre-existing SVG (web) / code-drawn native scene fallback. The SVG fallback
// also renders through a real <img> tag and can declare a 1200x800 viewBox, so
// naturalWidth/naturalHeight alone cannot tell it apart from a real asset —
// only a raster file extension indicates an actual physical editorial asset.
async function assertPhysicalRasterVisual(locator, label) {
  const rasterImg = locator.locator('img[src$=".webp"], img[src*=".webp?"], img[src$=".png"], img[src*=".png?"], img[src$=".jpg"], img[src*=".jpg?"], img[src$=".jpeg"], img[src*=".jpeg?"]').first();
  const rasterCount = await rasterImg.count();
  if (!rasterCount) throw new Error(`${label}: expected a real physical raster <img> inside the chart visual, found a code-drawn/SVG scene instead`);
  await rasterImg.evaluate((el) => {
    if (el.complete) return true;
    return new Promise((resolve) => {
      el.addEventListener('load', resolve, { once: true });
      el.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 5000);
    });
  });
  const natural = await rasterImg.evaluate((el) => ({ src: el.currentSrc || el.src, naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight }));
  if (!natural.naturalWidth || !natural.naturalHeight) throw new Error(`${label}: physical chart image failed to decode (natural size 0x0)`);
  if (natural.naturalWidth < 1200 || natural.naturalHeight < 800) throw new Error(`${label}: physical chart image below the 1200x800 minimum (${natural.naturalWidth}x${natural.naturalHeight})`);
  const ratio = natural.naturalWidth / natural.naturalHeight;
  if (Math.abs(ratio - 1.5) > 0.002) throw new Error(`${label}: physical chart image is not exact 3:2 (${natural.naturalWidth}x${natural.naturalHeight}, ratio ${ratio.toFixed(4)})`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    for (const lesson of lessons) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const diagnostics = [];
      page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
      page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
      await openLesson(page, lesson.title);
      const first = await page.getByText(/Adım 1\//).innerText();
      const total = Number(first.match(/\/(\d+)/)?.[1] ?? 1);
      for (let step = 1; step <= total; step += 1) {
        const label = `${lesson.key}-${viewport.name}-step-${step}`;
        await noOverflow(page, label);
        const { locator, box } = await largestImageLocator(page);
        if (!box) throw new Error(`${label}: no visible chart teaching visual found`);
        if (box.width < viewport.minVisualWidth) throw new Error(`${label}: visual too small at ${box.width.toFixed(1)}px`);
        if (box.width > (viewport.width < 500 ? 360 : 620) + 1) throw new Error(`${label}: visual too wide at ${box.width.toFixed(1)}px`);
        if (box.x < -1 || box.x + box.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (box.height > viewport.height * 0.72) throw new Error(`${label}: visual too tall at ${box.height.toFixed(1)}px`);
        assertLandscape(box, label);
        await assertPhysicalRasterVisual(locator, label);
        const legacy = page.locator(legacySelectors.join(', '));
        if (await legacy.count()) throw new Error(`${label}: legacy card-based chart composition must not replace the physical teaching image`);
        if (step === 2 || step === 3 || step === total) await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        if (step < total) { await page.getByRole('button', { name: /Sonraki adıma geç/i }).click(); await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor(); }
      }
      if (diagnostics.length) throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${total}/${total} physical-raster 3:2 chart steps PASS`);
    }
  }
} finally {
  await browser.close();
}
