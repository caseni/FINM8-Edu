import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];
const lessons = [
  { key: 'zones', title: 'Fiyat neden bazı bölgelerde tekrar durur', maxHeightRatio: 0.72 },
  { key: 'momentum', title: 'Hareket neden bazen hızlanır, bazen yavaşlar', maxHeightRatio: 0.72 },
  { key: 'average', title: 'Grafikteki yardımcı çizgi geleceği bilir mi', maxHeightRatio: 0.72 },
];

async function openChartLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Grafikleri Korkmadan Oku/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(title, 'i') }).click();
  await page.getByText(/Adım 1\//).waitFor();
}

async function largestImage(page) {
  const images = page.locator('[role="img"]');
  let largest;
  for (let i = 0; i < await images.count(); i += 1) {
    const image = images.nth(i);
    if (!(await image.isVisible())) continue;
    const box = await image.boundingBox();
    if (box && (!largest || box.width * box.height > largest.width * largest.height)) largest = box;
  }
  return largest;
}

async function noOverflow(page, label) {
  const d = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  if (d.page > d.viewport + 1) throw new Error(`${label}: horizontal overflow ${d.page}px > ${d.viewport}px`);
}

async function boxFor(page, aria, label) {
  const node = page.locator(`[aria-label="${aria}"]`).first();
  await node.waitFor();
  const box = await node.boundingBox();
  if (!box) throw new Error(`${label}: ${aria} is not measurable`);
  return box;
}

function inside(box, viewport, label) {
  if (box.x < -1 || box.x + box.width > viewport.width + 1) throw new Error(`${label}: element escapes viewport`);
}

async function pair(page, viewport, leftAria, rightAria, label, minMobile = 120, minDesktop = 180) {
  const left = await boxFor(page, leftAria, label);
  const right = await boxFor(page, rightAria, label);
  const min = viewport.sizeClass === 'mobile' ? minMobile : minDesktop;
  for (const box of [left, right]) {
    if (box.width < min) throw new Error(`${label}: comparison card too narrow at ${box.width.toFixed(1)}px`);
    inside(box, viewport, label);
  }
  if (Math.abs(left.y - right.y) > 8) throw new Error(`${label}: comparison cards must stay aligned`);
  if (right.x <= left.x + left.width) throw new Error(`${label}: comparison cards overlap`);
}

async function assertZones(page, viewport, step, label) {
  if (step === 1) {
    const map = await boxFor(page, 'chart-zone-map', label);
    if (map.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: zone map too compressed`);
  }
  if (step === 2) await pair(page, viewport, 'chart-zone-single-line', 'chart-zone-reaction-area', label);
  if (step === 3) {
    const reactions = await boxFor(page, 'chart-zone-repeated-reactions', label);
    if (reactions.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: repeated-reaction map too compressed`);
  }
  if (step === 4) await pair(page, viewport, 'chart-zone-hard-wall', 'chart-zone-soft-reaction', label);
}

async function assertMomentum(page, viewport, step, label) {
  if (step === 1) await pair(page, viewport, 'chart-momentum-fast', 'chart-momentum-slow', label);
  if (step === 2) {
    const meter = await boxFor(page, 'chart-momentum-meter', label);
    if (meter.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: momentum meter too compressed`);
  }
  if (step === 3) {
    const fading = await boxFor(page, 'chart-momentum-fading', label);
    if (fading.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: fading momentum board too compressed`);
  }
  if (step === 4) {
    const now = await boxFor(page, 'chart-momentum-strong-now', label);
    const future = await boxFor(page, 'chart-momentum-unknown-future', label);
    if (now.width < (viewport.sizeClass === 'mobile' ? 150 : 300)) throw new Error(`${label}: current momentum context too narrow`);
    if (future.width < (viewport.sizeClass === 'mobile' ? 80 : 100)) throw new Error(`${label}: unknown future card too narrow`);
    if (future.x <= now.x + now.width) throw new Error(`${label}: momentum future card overlaps current context`);
  }
}

async function assertAverage(page, viewport, step, label) {
  if (step === 1) {
    const chart = await boxFor(page, 'chart-average-past-and-smooth', label);
    if (chart.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: moving-average chart too compressed`);
  }
  if (step === 2) {
    const formula = await boxFor(page, 'chart-average-formula', label);
    if (formula.width < (viewport.sizeClass === 'mobile' ? 240 : 420)) throw new Error(`${label}: moving-average formula too compressed`);
  }
  if (step === 3) await pair(page, viewport, 'chart-average-short', 'chart-average-long', label);
  if (step === 4) {
    const cross = await boxFor(page, 'chart-average-cross', label);
    const future = await boxFor(page, 'chart-average-unknown-future', label);
    if (cross.width < (viewport.sizeClass === 'mobile' ? 150 : 300)) throw new Error(`${label}: average-cross context too narrow`);
    if (future.width < (viewport.sizeClass === 'mobile' ? 80 : 100)) throw new Error(`${label}: average future card too narrow`);
    if (future.x <= cross.x + cross.width) throw new Error(`${label}: average future card overlaps cross context`);
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
      const first = await page.getByText(/Adım 1\//).innerText();
      const total = Number(first.match(/\/(\d+)/)?.[1] ?? 1);
      for (let step = 1; step <= total; step += 1) {
        const label = `applied-chart-${viewport.name}-${lesson.key}-step-${step}`;
        await noOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible chart visual found`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too small at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * lesson.maxHeightRatio) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);
        if (lesson.key === 'zones') await assertZones(page, viewport, step, label);
        if (lesson.key === 'momentum') await assertMomentum(page, viewport, step, label);
        if (lesson.key === 'average') await assertAverage(page, viewport, step, label);
        if (step === 2 || step === 3 || step === total) await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        if (step < total) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor();
        }
      }
      if (diagnostics.length) throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${total}/${total} applied chart responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}
