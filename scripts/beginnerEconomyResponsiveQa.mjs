import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220, minBoardWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240, minBoardWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300, minBoardWidth: 420 },
];

const lessons = [
  { key: 'inflation', title: 'Aynı para neden zamanla daha az şey alır' },
  { key: 'rates', title: 'Faiz neyi etkiler' },
  { key: 'central-bank', title: 'Merkez bankası neden önemlidir' },
  { key: 'policy', title: 'Faiz değişince ekonomi nasıl etkilenir' },
  { key: 'growth', title: 'Ekonomi büyüyor demek ne demek' },
  { key: 'cycle', title: 'Ekonomi neden bazen yavaşlar' },
];

const stepRoles = ['hook', 'concept', 'practice', 'misconception', 'summary'];

async function openEconomyLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Para ve Ekonomi/i }).first().click();
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
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (dimensions.page > dimensions.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${dimensions.page}px > ${dimensions.viewport}px`);
  }
}

async function semanticBoard(page, viewport, key, step, label) {
  const role = stepRoles[step - 1];
  const aria = `economy-${key}-${role}-board`;
  const node = page.locator(`[aria-label="${aria}"]`).first();
  await node.waitFor();
  const box = await node.boundingBox();
  if (!box) throw new Error(`${label}: ${aria} is not measurable`);
  if (box.width < viewport.minBoardWidth) throw new Error(`${label}: teaching board too narrow at ${box.width.toFixed(1)}px`);
  if (box.height < (viewport.sizeClass === 'mobile' ? 90 : 125)) throw new Error(`${label}: teaching board too short at ${box.height.toFixed(1)}px`);
  if (box.x < -1 || box.x + box.width > viewport.width + 1) throw new Error(`${label}: teaching board escapes viewport`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    for (const lesson of lessons) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const diagnostics = [];
      page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
      page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));

      await openEconomyLesson(page, lesson.title);
      const first = await page.getByText(/Adım 1\//).innerText();
      const total = Number(first.match(/\/(\d+)/)?.[1] ?? 1);
      if (total !== 5) throw new Error(`${viewport.name}/${lesson.key}: expected 5 lesson steps, got ${total}`);

      for (let step = 1; step <= total; step += 1) {
        const label = `economy-${viewport.name}-${lesson.key}-step-${step}`;
        await noOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible economy visual found`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too small at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.72) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);
        await semanticBoard(page, viewport, lesson.key, step, label);

        if (step === 2 || step === 3 || step === total) {
          await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        }
        if (step < total) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor();
        }
      }

      if (diagnostics.length) throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${total}/${total} economy responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}