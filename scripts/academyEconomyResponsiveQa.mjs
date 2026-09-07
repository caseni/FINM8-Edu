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

function escapedRegex(value) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

async function openLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  await page.getByRole('button', { name: /^Ekonomiyi Anla derslerini aç$/i }).click();
  await page.getByRole('button', { name: escapedRegex(title) }).first().click();
  await page.getByText(/Adım 1\//).waitFor();
}

async function largestImage(page) {
  const { box } = await largestImageLocator(page);
  return box;
}

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

// The six Wave1 Economy foundation lessons are reused by both the Beginner journey
// and this Academy track. Non-hook roles with a real physical mapping must now
// render the same physical Beginner Economy raster through the canonical routing
// fix in LessonSupportingVisual.tsx; the four intentionally example-only roles
// must keep showing the pre-existing code-drawn/SVG fallback, never a raster image.
const reusedEconomyExampleOnlyRoles = {
  inflation: [],
  rates: ['misconception'],
  'central-bank': ['practice'],
  'monetary-policy': ['misconception'],
  growth: ['practice'],
  cycle: [],
};
const stepRoles = ['hook', 'concept', 'practice', 'misconception', 'summary'];

// Guards against the false-positive where a code-drawn scene (a plain View with a
// hardcoded aspectRatio style) satisfies sizing checks without any real physical
// editorial asset behind it. A pre-existing SVG fallback also renders through a
// real <img> tag (and can declare a 1200x800 viewBox), so only a raster
// (webp/png/jpg) src reliably indicates an actual physical editorial asset.
async function assertPhysicalEditorialImage(locator, label, { shouldExist }) {
  const rasterImg = locator.locator('img[src$=".webp"], img[src*=".webp?"], img[src$=".png"], img[src*=".png?"], img[src$=".jpg"], img[src*=".jpg?"], img[src$=".jpeg"], img[src*=".jpeg?"]').first();
  const rasterCount = await rasterImg.count();

  if (!shouldExist) {
    if (rasterCount) throw new Error(`${label}: expected no physical editorial <img> for this example-only role, but found one`);
    return;
  }

  if (!rasterCount) {
    throw new Error(`${label}: expected a real physical editorial <img> inside the lesson visual, found a code-drawn scene instead`);
  }
  await rasterImg.evaluate((el) => {
    if (el.complete) return true;
    return new Promise((resolve) => {
      el.addEventListener('load', resolve, { once: true });
      el.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 5000);
    });
  });
  const natural = await rasterImg.evaluate((el) => ({
    src: el.currentSrc || el.src,
    naturalWidth: el.naturalWidth,
    naturalHeight: el.naturalHeight,
  }));
  if (!natural.naturalWidth || !natural.naturalHeight) {
    throw new Error(`${label}: physical editorial image failed to decode (natural size 0x0)`);
  }
  if (natural.naturalWidth < 1200 || natural.naturalHeight < 800) {
    throw new Error(`${label}: physical editorial image below the 1200x800 minimum (${natural.naturalWidth}x${natural.naturalHeight})`);
  }
  const ratio = natural.naturalWidth / natural.naturalHeight;
  if (Math.abs(ratio - 1.5) > 0.002) {
    throw new Error(`${label}: physical editorial image is not exact 3:2 (${natural.naturalWidth}x${natural.naturalHeight}, ratio ${ratio.toFixed(4)})`);
  }
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
        const { locator, box: visual } = await largestImageLocator(page);
        if (!visual) throw new Error(`${label}: no visible lesson visual`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too narrow at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.75) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);

        const reusedExampleOnly = reusedEconomyExampleOnlyRoles[lesson.key];
        if (reusedExampleOnly && step > 1) {
          const role = stepRoles[step - 1];
          await assertPhysicalEditorialImage(locator, label, { shouldExist: !reusedExampleOnly.includes(role) });
        }

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