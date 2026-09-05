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
    maxWidth: { mobile: 360, desktop: 520 },
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

async function pairedBoxes(page, leftLabel, rightLabel, label) {
  const left = page.locator(`[aria-label="${leftLabel}"]`).first();
  const right = page.locator(`[aria-label="${rightLabel}"]`).first();
  await left.waitFor();
  await right.waitFor();
  const leftBox = await left.boundingBox();
  const rightBox = await right.boundingBox();
  if (!leftBox || !rightBox) throw new Error(`${label}: comparison cards have no measurable boxes`);
  return [leftBox, rightBox];
}

async function assertResponsivePair(page, viewport, leftLabel, rightLabel, label) {
  const [leftBox, rightBox] = await pairedBoxes(page, leftLabel, rightLabel, label);
  const minCardWidth = viewport.sizeClass === 'mobile' ? 120 : 180;
  for (const box of [leftBox, rightBox]) {
    if (box.width < minCardWidth) {
      throw new Error(`${label}: comparison card too narrow at ${box.width.toFixed(1)}px`);
    }
    if (box.x < -1 || box.x + box.width > viewport.width + 1) {
      throw new Error(`${label}: comparison card escapes viewport`);
    }
  }
  if (Math.abs(leftBox.y - rightBox.y) > 8) {
    throw new Error(`${label}: comparison cards must remain aligned in one row`);
  }
  if (rightBox.x <= leftBox.x + leftBox.width) {
    throw new Error(`${label}: comparison cards overlap`);
  }
}

async function assertThreeAcross(page, viewport, labels, label) {
  const boxes = [];
  for (const itemLabel of labels) {
    const node = page.locator(`[aria-label="${itemLabel}"]`).first();
    await node.waitFor();
    const box = await node.boundingBox();
    if (!box) throw new Error(`${label}: ${itemLabel} has no measurable box`);
    boxes.push(box);
  }

  const minWidth = viewport.sizeClass === 'mobile' ? 72 : 145;
  for (const box of boxes) {
    if (box.width < minWidth) throw new Error(`${label}: three-way card too narrow at ${box.width.toFixed(1)}px`);
    if (box.x < -1 || box.x + box.width > viewport.width + 1) throw new Error(`${label}: three-way card escapes viewport`);
  }
  if (Math.max(...boxes.map((box) => box.y)) - Math.min(...boxes.map((box) => box.y)) > 8) {
    throw new Error(`${label}: three-way comparison must remain on one row`);
  }
  for (let index = 1; index < boxes.length; index += 1) {
    if (boxes[index].x <= boxes[index - 1].x + boxes[index - 1].width) {
      throw new Error(`${label}: three-way cards overlap`);
    }
  }
}

function assertEditorialLandscape(visualBox, label) {
  const ratio = visualBox.width / visualBox.height;
  if (ratio < 1.47 || ratio > 1.53) {
    throw new Error(`${label}: editorial lesson image is distorted at ${ratio.toFixed(2)}:1; expected 3:2`);
  }
}

async function assertLiquidityComposition(page, viewport, step, label, visualBox) {
  if (step === 1) {
    assertEditorialLandscape(visualBox, label);
    const legacyCards = page.locator('[aria-label="likidite-senaryo-kalabalik"], [aria-label="likidite-senaryo-sig"]');
    if (await legacyCards.count()) {
      throw new Error(`${label}: legacy many/few buyer card infographic must not replace the editorial scene`);
    }
  }
  if (step === 3) {
    await assertResponsivePair(page, viewport, 'likidite-kucuk-emir', 'likidite-buyuk-emir', label);
  }
}

async function assertBidAskComposition(page, viewport, step, label) {
  if (step === 1) {
    await assertResponsivePair(page, viewport, 'bid-ask-buyer-side', 'bid-ask-seller-side', label);
  }
  if (step === 2) {
    await assertResponsivePair(page, viewport, 'bid-ask-concept-bid', 'bid-ask-concept-ask', label);
    const gap = page.locator('[aria-label="bid-ask-spread-gap"]').first();
    await gap.waitFor();
    const gapBox = await gap.boundingBox();
    if (!gapBox || gapBox.width < 45) {
      throw new Error(`${label}: spread gap must remain visibly readable`);
    }
  }
  if (step === 3) {
    await assertResponsivePair(page, viewport, 'bid-ask-buy-now', 'bid-ask-sell-now', label);
  }
  if (step === 4) {
    const lastTrade = page.locator('[aria-label="bid-ask-last-trade"]').first();
    const currentQuotes = page.locator('[aria-label="bid-ask-current-quotes"]').first();
    await lastTrade.waitFor();
    await currentQuotes.waitFor();
    const lastTradeBox = await lastTrade.boundingBox();
    const currentQuotesBox = await currentQuotes.boundingBox();
    if (!lastTradeBox || !currentQuotesBox) throw new Error(`${label}: bid-ask misconception blocks are not measurable`);
    if (currentQuotesBox.y <= lastTradeBox.y + lastTradeBox.height) {
      throw new Error(`${label}: current quotes must remain visually separate below last trade`);
    }
  }
}

async function assertOrderTypesComposition(page, viewport, step, label) {
  if (step === 1) {
    await assertThreeAcross(page, viewport, ['order-market-path', 'order-limit-boundary', 'order-stop-trigger'], label);
  }
  if (step === 2) {
    await assertThreeAcross(page, viewport, ['order-concept-market', 'order-concept-limit', 'order-concept-stop'], label);
  }
  if (step === 3) {
    const limit = page.locator('[aria-label="order-practice-limit"]').first();
    const stop = page.locator('[aria-label="order-practice-stop"]').first();
    await limit.waitFor();
    await stop.waitFor();
    const limitBox = await limit.boundingBox();
    const stopBox = await stop.boundingBox();
    if (!limitBox || !stopBox) throw new Error(`${label}: order practice levels are not measurable`);
    if (stopBox.y <= limitBox.y + 20) throw new Error(`${label}: stop trigger must remain visibly below limit boundary`);
  }
  if (step === 4) {
    await assertResponsivePair(page, viewport, 'order-limit-no-fill', 'order-stop-not-exact-fill', label);
  }
}

async function assertSlippageComposition(page, viewport, step, label) {
  if (step === 1) {
    await assertResponsivePair(page, viewport, 'slippage-hook-screen', 'slippage-hook-fill', label);
    const process = page.locator('[aria-label="slippage-execution-process"]').first();
    await process.waitFor();
    const processBox = await process.boundingBox();
    if (!processBox || processBox.width < (viewport.sizeClass === 'mobile' ? 70 : 140)) {
      throw new Error(`${label}: execution process is too compressed`);
    }
  }
  if (step === 2) {
    await assertResponsivePair(page, viewport, 'slippage-concept-expected', 'slippage-concept-actual', label);
    const depth = page.locator('[aria-label="slippage-concept-depth"]').first();
    await depth.waitFor();
    const depthBox = await depth.boundingBox();
    if (!depthBox || depthBox.width < (viewport.sizeClass === 'mobile' ? 95 : 170)) {
      throw new Error(`${label}: available price levels are too compressed`);
    }
  }
  if (step === 3) {
    await assertResponsivePair(page, viewport, 'slippage-practice-expected', 'slippage-practice-actual', label);
  }
  if (step === 4) {
    await assertResponsivePair(page, viewport, 'slippage-misconception-screen', 'slippage-misconception-market', label);
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
          const box = await largestVisibleImageBox(page);
          if (!box) throw new Error(`${label}: no visible lesson visual found`);
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
            await assertBidAskComposition(page, viewport, step, label);
          }
          if (lesson.key === 'order-types') {
            await assertOrderTypesComposition(page, viewport, step, label);
          }
          if (lesson.key === 'slippage') {
            await assertSlippageComposition(page, viewport, step, label);
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
