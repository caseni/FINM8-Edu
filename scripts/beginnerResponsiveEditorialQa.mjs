import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];
const lessons = [
  {
    key: 'price-formation',
    title: 'Bir fiyat nasıl ortaya çıkar',
    maxWidth: { mobile: 360, desktop: 620 },
    maxHeightRatio: 0.68,
  },
  {
    key: 'market-instruments',
    title: 'Piyasada aldığın şey aslında nedir',
    maxWidth: { mobile: 360, desktop: 700 },
    maxHeightRatio: 0.72,
  },
  {
    key: 'liquidity',
    title: 'Neden bazen alıp satmak kolay, bazen zor',
    maxWidth: { mobile: 360, desktop: 700 },
    maxHeightRatio: 0.72,
  },
  {
    key: 'bid-ask',
    title: 'Alış ve satış fiyatı neden farklı olabilir',
    maxWidth: { mobile: 360, desktop: 700 },
    maxHeightRatio: 0.72,
  },
  {
    key: 'order-types',
    title: 'Emir verirken aslında ne seçiyorsun',
    maxWidth: { mobile: 360, desktop: 700 },
    maxHeightRatio: 0.72,
  },
  {
    key: 'slippage',
    title: 'Ekrandaki fiyat neden işlem fiyatın olmayabilir',
    maxWidth: { mobile: 360, desktop: 700 },
    maxHeightRatio: 0.72,
  },
];

async function openMarketLesson(page, lessonTitle) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Piyasalar Nasıl Çalışır/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 7 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: new RegExp(lessonTitle, 'i') }).click();
  await page.getByText(/Adım 1\//).waitFor();
}

async function largestVisibleImageLocator(page) {
  const images = page.locator('[role="img"]');
  const count = await images.count();
  let largest;
  let largestLocator;
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    if (!(await image.isVisible())) continue;
    const box = await image.boundingBox();
    if (!box) continue;
    if (!largest || box.width * box.height > largest.width * largest.height) {
      largest = box;
      largestLocator = image;
    }
  }
  return { locator: largestLocator, box: largest };
}

// Guards against the false-positive where a code-drawn scene (a plain View with a
// hardcoded aspectRatio style) satisfies the 3:2 bounding-box check without any real
// physical editorial asset behind it. This asserts an actual decoded <img> exists
// inside the largest visible [role="img"] container, at a real photographic
// resolution and exact 3:2 ratio. Markets/Economy physical assets are committed at
// 1200x800 or larger (the pre-existing price-formation-*.webp set is 1536x1024), so
// this checks "at least 1200x800 and exact 3:2" rather than an exact pixel match,
// which would otherwise fail on that legitimate larger asset.
async function assertPhysicalEditorialImage(locator, label) {
  if (!locator) throw new Error(`${label}: no visible lesson visual to inspect for a physical image`);
  const img = locator.locator('img').first();
  const imgCount = await img.count();
  if (!imgCount) {
    throw new Error(`${label}: expected a real physical editorial <img> inside the lesson visual, found a code-drawn scene instead`);
  }
  await img.evaluate((el) => {
    if (el.complete) return true;
    return new Promise((resolve) => {
      el.addEventListener('load', resolve, { once: true });
      el.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 5000);
    });
  });
  const natural = await img.evaluate((el) => ({
    src: el.currentSrc || el.src,
    naturalWidth: el.naturalWidth,
    naturalHeight: el.naturalHeight,
  }));
  if (!/\.(webp|png|jpe?g)(\?|$)/i.test(natural.src)) {
    throw new Error(`${label}: physical editorial image src does not look like a real raster asset: ${natural.src}`);
  }
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

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (dimensions.page > dimensions.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${dimensions.page}px > ${dimensions.viewport}px`);
  }
}

async function instrumentCardBoxes(page, label) {
  const cardLabels = [
    'HİSSE: Şirkette ortaklık',
    'TAHVİL: Bir kuruma borç verme',
    'DÖVİZ: İki paranın göreli değeri',
    'EMTİA: Altın, petrol gibi ürünler',
  ];
  const boxes = [];
  for (const cardLabel of cardLabels) {
    const card = page.locator(`[aria-label="${cardLabel}"]`).first();
    await card.waitFor();
    const box = await card.boundingBox();
    if (!box) throw new Error(`${label}: instrument card ${cardLabel} has no measurable box`);
    boxes.push(box);
  }
  return boxes;
}

async function assertInstrumentCardGrid(page, viewport, label) {
  const boxes = await instrumentCardBoxes(page, label);
  const [stock, bond, fx, commodity] = boxes;
  const rowTolerance = 8;
  const minCardWidth = viewport.sizeClass === 'mobile' ? 120 : 160;

  for (const box of boxes) {
    if (box.width < minCardWidth) {
      throw new Error(`${label}: instrument meaning card too narrow at ${box.width.toFixed(1)}px`);
    }
    if (box.x < -1 || box.x + box.width > viewport.width + 1) {
      throw new Error(`${label}: instrument meaning card escapes viewport`);
    }
  }

  if (Math.abs(stock.y - bond.y) > rowTolerance || Math.abs(fx.y - commodity.y) > rowTolerance) {
    throw new Error(`${label}: instrument meaning cards must remain a stable two-column grid`);
  }
  if (fx.y <= stock.y + stock.height - 2 || commodity.y <= bond.y + bond.height - 2) {
    throw new Error(`${label}: second instrument-card row overlaps the first row`);
  }
  if (bond.x <= stock.x + stock.width || commodity.x <= fx.x + fx.width) {
    throw new Error(`${label}: instrument-card columns overlap`);
  }
}

async function assertInstrumentComposition(page, viewport, visualBox, label) {
  const meaning = page.getByText('Şirkette ortaklık', { exact: true }).first();
  await meaning.waitFor();
  const meaningBox = await meaning.boundingBox();
  if (!meaningBox) throw new Error(`${label}: instrument meaning card has no measurable box`);

  await assertInstrumentCardGrid(page, viewport, label);

  if (viewport.sizeClass === 'mobile') {
    if (visualBox.y <= meaningBox.y + meaningBox.height) {
      throw new Error(`${label}: mobile visual must sit below the meaning cards`);
    }
  } else if (visualBox.x <= meaningBox.x + meaningBox.width) {
    throw new Error(`${label}: desktop visual must sit to the right of the meaning cards`);
  }
}

async function assertTextLedInstrumentPractice(page, label) {
  await page.getByText('MİNİ ÖRNEK', { exact: true }).waitFor();
  await page.getByText(/Bir BIST hissesini almak şirkete ortaklık anlamına gelir/i).waitFor();
  const visibleImages = page.locator('[role="img"]:visible');
  if (await visibleImages.count()) {
    throw new Error(`${label}: instrument practice should stay text-led without a redundant lesson image`);
  }
}

function assertEditorialLandscape(visualBox, label) {
  const ratio = visualBox.width / visualBox.height;
  if (ratio < 1.47 || ratio > 1.53) {
    throw new Error(`${label}: editorial lesson image is distorted at ${ratio.toFixed(2)}:1; expected 3:2`);
  }
}

async function assertLiquidityComposition(page, viewport, step, label, visualBox) {
  assertEditorialLandscape(visualBox, label);

  const legacyInfographics = page.locator([
    '[aria-label="likidite-senaryo-kalabalik"]',
    '[aria-label="likidite-senaryo-sig"]',
    '[aria-label="likidite-kucuk-emir"]',
    '[aria-label="likidite-buyuk-emir"]',
  ].join(', '));
  if (await legacyInfographics.count()) {
    throw new Error(`${label}: legacy comparison-card infographic must not replace the editorial liquidity scene`);
  }

  if (visualBox.width < viewport.minVisualWidth) {
    throw new Error(`${label}: liquidity scene too narrow at ${visualBox.width.toFixed(1)}px`);
  }
  if (step < 1 || step > 5) {
    throw new Error(`${label}: unexpected liquidity lesson step ${step}`);
  }
}

async function assertBidAskComposition(page, viewport, step, label, visualBox) {
  assertEditorialLandscape(visualBox, label);

  const legacyInfographics = page.locator([
    '[aria-label="bid-ask-buyer-side"]',
    '[aria-label="bid-ask-seller-side"]',
    '[aria-label="bid-ask-concept-bid"]',
    '[aria-label="bid-ask-concept-ask"]',
    '[aria-label="bid-ask-buy-now"]',
    '[aria-label="bid-ask-sell-now"]',
    '[aria-label="bid-ask-last-trade"]',
    '[aria-label="bid-ask-current-quotes"]',
  ].join(', '));
  if (await legacyInfographics.count()) {
    throw new Error(`${label}: legacy bid/ask card layout must not replace the editorial price-rail scene`);
  }

  if (visualBox.width < viewport.minVisualWidth) {
    throw new Error(`${label}: bid/ask scene too narrow at ${visualBox.width.toFixed(1)}px`);
  }
  if (step < 1 || step > 5) {
    throw new Error(`${label}: unexpected bid/ask lesson step ${step}`);
  }
}

async function assertOrderTypesComposition(page, viewport, step, label, visualBox) {
  assertEditorialLandscape(visualBox, label);

  const legacyInfographics = page.locator([
    '[aria-label="order-market-path"]',
    '[aria-label="order-limit-boundary"]',
    '[aria-label="order-stop-trigger"]',
    '[aria-label="order-concept-market"]',
    '[aria-label="order-concept-limit"]',
    '[aria-label="order-concept-stop"]',
    '[aria-label="order-practice-limit"]',
    '[aria-label="order-practice-stop"]',
    '[aria-label="order-limit-no-fill"]',
    '[aria-label="order-stop-not-exact-fill"]',
  ].join(', '));
  if (await legacyInfographics.count()) {
    throw new Error(`${label}: legacy order-type card layout must not replace the editorial price-axis scene`);
  }

  if (visualBox.width < viewport.minVisualWidth) {
    throw new Error(`${label}: order-type scene too narrow at ${visualBox.width.toFixed(1)}px`);
  }
  if (step < 1 || step > 5) {
    throw new Error(`${label}: unexpected order-type lesson step ${step}`);
  }
}

async function assertSlippageComposition(page, viewport, step, label, visualBox) {
  assertEditorialLandscape(visualBox, label);

  const legacyInfographics = page.locator([
    '[aria-label="slippage-hook-screen"]',
    '[aria-label="slippage-hook-fill"]',
    '[aria-label="slippage-execution-process"]',
    '[aria-label="slippage-concept-expected"]',
    '[aria-label="slippage-concept-actual"]',
    '[aria-label="slippage-concept-depth"]',
    '[aria-label="slippage-practice-expected"]',
    '[aria-label="slippage-practice-actual"]',
    '[aria-label="slippage-misconception-screen"]',
    '[aria-label="slippage-misconception-market"]',
  ].join(', '));
  if (await legacyInfographics.count()) {
    throw new Error(`${label}: legacy slippage comparison cards must not replace the editorial execution-path scene`);
  }

  if (visualBox.width < viewport.minVisualWidth) {
    throw new Error(`${label}: slippage scene too narrow at ${visualBox.width.toFixed(1)}px`);
  }
  if (step < 1 || step > 5) {
    throw new Error(`${label}: unexpected slippage lesson step ${step}`);
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

      await openMarketLesson(page, lesson.title);
      const firstStepText = await page.getByText(/Adım 1\//).innerText();
      const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);

      for (let step = 1; step <= totalSteps; step += 1) {
        const label = `responsive-${viewport.name}-${lesson.key}-step-${step}`;
        const textLedInstrumentPractice = lesson.key === 'market-instruments' && step === 3;
        await assertNoHorizontalOverflow(page, label);

        if (textLedInstrumentPractice) {
          await assertTextLedInstrumentPractice(page, label);
        } else {
          const { locator, box } = await largestVisibleImageLocator(page);
          if (!box) throw new Error(`${label}: no visible lesson visual found`);
          await assertPhysicalEditorialImage(locator, label);
          if (box.width < viewport.minVisualWidth) {
            throw new Error(`${label}: lesson visual too small at ${box.width.toFixed(1)}px`);
          }
          if (box.width > lesson.maxWidth[viewport.sizeClass] + 1) {
            throw new Error(`${label}: lesson visual too wide at ${box.width.toFixed(1)}px`);
          }
          if (box.x < -1 || box.x + box.width > viewport.width + 1) {
            throw new Error(`${label}: lesson visual escapes viewport (${box.x.toFixed(1)}..${(box.x + box.width).toFixed(1)})`);
          }
          if (box.height > viewport.height * lesson.maxHeightRatio) {
            throw new Error(`${label}: lesson visual consumes too much viewport height (${box.height.toFixed(1)}px)`);
          }
          if (lesson.key === 'market-instruments' && step === 2) {
            await assertInstrumentComposition(page, viewport, box, label);
          }
          if (lesson.key === 'price-formation') {
            assertEditorialLandscape(box, label);
          }
          if (lesson.key === 'liquidity') {
            await assertLiquidityComposition(page, viewport, step, label, box);
          }
          if (lesson.key === 'bid-ask') {
            await assertBidAskComposition(page, viewport, step, label, box);
          }
          if (lesson.key === 'order-types') {
            await assertOrderTypesComposition(page, viewport, step, label, box);
          }
          if (lesson.key === 'slippage') {
            await assertSlippageComposition(page, viewport, step, label, box);
          }
        }

        if (step === 2 || step === 3 || step === totalSteps) {
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
        throw new Error(`${viewport.name}/${lesson.key} diagnostics:\n${diagnostics.join('\n')}`);
      }
      await page.close();
      console.log(`${viewport.name}/${lesson.key}: ${totalSteps}/${totalSteps} responsive lesson steps PASS`);
    }
  }
} finally {
  await browser.close();
}