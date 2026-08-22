import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile', width: 390, height: 844, minVisualWidth: 240, maxVisualWidth: 360 },
  { name: 'desktop', width: 1440, height: 900, minVisualWidth: 300, maxVisualWidth: 520 },
];

async function openPriceFormationLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Piyasalar Nasıl Çalışır/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Bir fiyat nasıl ortaya çıkar/i }).click();
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

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const diagnostics = [];
    page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
    page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));

    await openPriceFormationLesson(page);
    const firstStepText = await page.getByText(/Adım 1\//).innerText();
    const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);

    for (let step = 1; step <= totalSteps; step += 1) {
      const label = `responsive-${viewport.name}-price-formation-step-${step}`;
      await assertNoHorizontalOverflow(page, label);
      const box = await largestVisibleImageBox(page);
      if (!box) throw new Error(`${label}: no visible editorial image found`);
      if (box.width < viewport.minVisualWidth) {
        throw new Error(`${label}: editorial image too small at ${box.width.toFixed(1)}px`);
      }
      if (box.width > viewport.maxVisualWidth + 1) {
        throw new Error(`${label}: editorial image too wide at ${box.width.toFixed(1)}px`);
      }
      if (box.x < -1 || box.x + box.width > viewport.width + 1) {
        throw new Error(`${label}: editorial image escapes viewport (${box.x.toFixed(1)}..${(box.x + box.width).toFixed(1)})`);
      }
      if (box.height > viewport.height * 0.68) {
        throw new Error(`${label}: editorial image consumes too much viewport height (${box.height.toFixed(1)}px)`);
      }

      if (step === 3 || step === totalSteps) {
        await page.screenshot({
          path: `visual-qa/${label}.png`,
          fullPage: true,
        });
      }

      if (step < totalSteps) {
        await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
        await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
      }
    }

    if (diagnostics.length > 0) {
      throw new Error(`${viewport.name} responsive editorial diagnostics:\n${diagnostics.join('\n')}`);
    }
    await page.close();
    console.log(`${viewport.name}: ${totalSteps}/${totalSteps} responsive editorial steps PASS`);
  }
} finally {
  await browser.close();
}
