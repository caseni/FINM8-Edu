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

// Roles intentionally left without a physical editorial image per
// docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json — these stay on the code-drawn
// SVG/native fallback and must never show a real <img>.
const exampleOnlyRoles = {
  inflation: [],
  rates: ['misconception'],
  'central-bank': ['practice'],
  policy: ['misconception'],
  growth: ['practice'],
  cycle: [],
};

async function openEconomyLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Para ve Ekonomi/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(title, 'i') }).click();
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

// Guards against the false-positive where a code-drawn scene (a plain View with a
// hardcoded aspectRatio style) satisfies sizing checks without any real physical
// editorial asset behind it. Requires a real decoded <img> at photographic
// resolution and exact 3:2 ratio; requires no such <img> for example-only roles.
async function assertPhysicalEditorialImage(locator, label, { shouldExist }) {
  // The pre-existing SVG fallback also renders through a real <img> tag (and an
  // authored SVG can declare a 1200x800 viewBox, so naturalWidth/naturalHeight
  // alone cannot tell it apart from a real photo) — only a raster extension
  // (webp/png/jpg) indicates an actual physical editorial asset.
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
        const { locator, box: visual } = await largestImageLocator(page);
        if (!visual) throw new Error(`${label}: no visible economy visual found`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too small at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.72) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);
        const role = stepRoles[step - 1];
        const shouldHavePhysicalImage = !exampleOnlyRoles[lesson.key].includes(role);
        if (!shouldHavePhysicalImage) {
          // Example-only roles still render through the pre-existing shell/board
          // scene, which carries this semantic aria-label. Mapped roles now render
          // through the canonical BeginnerEditorialImageVisual component instead,
          // which doesn't (and shouldn't) emit this board-specific label — those are
          // covered by the general visual sizing checks above plus the raster
          // assertion below.
          await semanticBoard(page, viewport, lesson.key, step, label);
        }
        await assertPhysicalEditorialImage(locator, label, { shouldExist: shouldHavePhysicalImage });

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