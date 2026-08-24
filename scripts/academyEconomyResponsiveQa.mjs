import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];

const lessons = [
  { key: 'inflation', title: 'Aynı para neden zamanla daha az şey alır?', hook: 'academy-economy-hook-inflation' },
  { key: 'rates', title: 'Faiz neyi etkiler?', hook: 'academy-economy-hook-rates' },
  { key: 'central-bank', title: 'Merkez bankası neden önemlidir?', hook: 'academy-economy-hook-central-bank' },
  { key: 'monetary-policy', title: 'Faiz değişince ekonomi nasıl etkilenir?', hook: 'academy-economy-hook-monetary-policy' },
  { key: 'growth', title: 'Ekonomi büyüyor demek ne demek?', hook: 'academy-economy-hook-growth' },
  { key: 'cycle', title: 'Ekonomi neden bazen yavaşlar?', hook: 'academy-economy-hook-cycle' },
  { key: 'labor-market', title: 'İşsizlik verisi ne anlatır?' },
  { key: 'fiscal-policy', title: 'Maliye politikası nedir?' },
  { key: 'exchange-rates', title: 'Döviz kuru neden değişir?' },
  { key: 'productivity', title: 'Verimlilik neden uzun vadede önemlidir?' },
  { key: 'indicators', title: 'Ekonomik veri nasıl doğru okunur?' },
  { key: 'real-nominal', title: 'Reel ve nominal farkı nedir?' },
];

async function openLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  await page.getByRole('button', { name: /^Ekonomiyi Anla derslerini aç$/i }).click();
  await page.getByRole('button', { name: title, exact: true }).click();
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

async function assertNoOverflow(page, label) {
  const d = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  if (d.page > d.viewport + 1) throw new Error(`${label}: horizontal overflow ${d.page}px > ${d.viewport}px`);
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
      const stepText = await page.getByText(/Adım 1\//).innerText();
      const total = Number(stepText.match(/\/(\d+)/)?.[1] ?? 1);
      if (total !== 5) throw new Error(`${viewport.name}/${lesson.key}: expected 5 steps, got ${total}`);

      for (let step = 1; step <= total; step += 1) {
        const label = `academy-economy-${viewport.name}-${lesson.key}-step-${step}`;
        await assertNoOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible lesson visual`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too narrow at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.75) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);

        if (step === 1 && lesson.hook) {
          const hook = page.locator(`[aria-label="${lesson.hook}"]`).first();
          await hook.waitFor();
          const hookBox = await hook.boundingBox();
          if (!hookBox) throw new Error(`${label}: premium hook is not measurable`);
          if (hookBox.width < (viewport.sizeClass === 'mobile' ? viewport.minVisualWidth - 20 : 400)) throw new Error(`${label}: premium hook stage too narrow at ${hookBox.width.toFixed(1)}px`);
          if (hookBox.height < (viewport.sizeClass === 'mobile' ? 200 : 260)) throw new Error(`${label}: premium hook stage too short at ${hookBox.height.toFixed(1)}px`);
        }

        if (step === 1 || step === 3 || step === total) await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        if (step < total) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor();
        }
      }

      if (diagnostics.length) throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${total}/${total} Academy economy responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}