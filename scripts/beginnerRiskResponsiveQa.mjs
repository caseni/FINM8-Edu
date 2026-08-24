import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];

const lessons = [
  { key: 'uncertainty', title: 'Kaybetmeden önce risk var mıdır', maxHeightRatio: 0.72 },
  { key: 'volatility', title: 'Fiyat çok oynuyorsa neden daha dikkatli olmalısın', maxHeightRatio: 0.72 },
  { key: 'size', title: 'Ne kadar aldığın neden önemlidir', maxHeightRatio: 0.72 },
  { key: 'reward', title: 'Büyük hedef iyi karar demek midir', maxHeightRatio: 0.72 },
  { key: 'stop', title: 'Çıkış fiyatı neden garanti değildir', maxHeightRatio: 0.72 },
  { key: 'diversification', title: 'Parayı farklı şeylere bölmek riski nasıl değiştirir', maxHeightRatio: 0.72 },
];

async function openRiskLesson(page, title) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Riskten Korun/i }).first().click();
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

async function boxFor(page, aria, label) {
  const node = page.locator(`[aria-label="${aria}"]`).first();
  await node.waitFor();
  const box = await node.boundingBox();
  if (!box) throw new Error(`${label}: ${aria} is not measurable`);
  return box;
}

function inside(box, viewport, label) {
  if (box.x < -1 || box.x + box.width > viewport.width + 1) {
    throw new Error(`${label}: element escapes viewport`);
  }
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

async function fullBoard(page, viewport, aria, label, minMobile = 240, minDesktop = 420) {
  const box = await boxFor(page, aria, label);
  const min = viewport.sizeClass === 'mobile' ? minMobile : minDesktop;
  if (box.width < min) throw new Error(`${label}: ${aria} too compressed at ${box.width.toFixed(1)}px`);
  inside(box, viewport, label);
}

async function assertUncertainty(page, viewport, step, label) {
  if (step === 1) await fullBoard(page, viewport, 'risk-uncertainty-branches', label);
  if (step === 2) await pair(page, viewport, 'risk-possibility', 'risk-realized-loss', label);
  if (step === 3) await pair(page, viewport, 'risk-before', 'risk-after', label);
  if (step === 4) {
    const main = await boxFor(page, 'risk-zero-loss', label);
    const future = await boxFor(page, 'risk-future-uncertainty', label);
    if (main.width < (viewport.sizeClass === 'mobile' ? 150 : 300)) throw new Error(`${label}: realized-loss context too narrow`);
    if (future.width < (viewport.sizeClass === 'mobile' ? 80 : 150)) throw new Error(`${label}: uncertainty card too narrow`);
    inside(main, viewport, label);
    inside(future, viewport, label);
    if (future.x <= main.x + main.width) throw new Error(`${label}: uncertainty card overlaps realized-loss context`);
  }
}

async function assertVolatility(page, viewport, step, label) {
  if (step === 1) await pair(page, viewport, 'risk-vol-calm', 'risk-vol-active', label);
  if (step === 2) {
    const narrow = await boxFor(page, 'risk-vol-narrow', label);
    const wide = await boxFor(page, 'risk-vol-wide', label);
    if (narrow.width < (viewport.sizeClass === 'mobile' ? 220 : 400)) throw new Error(`${label}: narrow-range explanation too compressed`);
    if (wide.width < (viewport.sizeClass === 'mobile' ? 220 : 400)) throw new Error(`${label}: wide-range explanation too compressed`);
  }
  if (step === 3) await pair(page, viewport, 'risk-vol-same-cash-calm', 'risk-vol-same-cash-wide', label);
  if (step === 4) await pair(page, viewport, 'risk-vol-up', 'risk-vol-down', label);
}

async function assertSize(page, viewport, step, label) {
  if (step === 1) await pair(page, viewport, 'risk-size-small', 'risk-size-large', label);
  if (step === 2) await fullBoard(page, viewport, 'risk-size-equation', label);
  if (step === 3) await fullBoard(page, viewport, 'risk-size-exposure', label);
  if (step === 4) await pair(page, viewport, 'risk-size-can-buy', 'risk-size-fit', label);
}

async function assertReward(page, viewport, step, label) {
  if (step === 1) {
    const loss = await boxFor(page, 'risk-reward-loss', label);
    const target = await boxFor(page, 'risk-reward-target', label);
    const minimum = viewport.sizeClass === 'mobile' ? 70 : 120;
    if (loss.width < minimum || target.width < minimum) throw new Error(`${label}: reward ratio cards too narrow`);
    inside(loss, viewport, label);
    inside(target, viewport, label);
  }
  if (step === 2) await fullBoard(page, viewport, 'risk-reward-factors', label);
  if (step === 3) await fullBoard(page, viewport, 'risk-reward-decision-pieces', label);
  if (step === 4) await pair(page, viewport, 'risk-reward-paper', 'risk-reward-reality', label);
}

async function assertStop(page, viewport, step, label) {
  if (step === 1) await pair(page, viewport, 'risk-stop-plan', 'risk-stop-actual', label);
  if (step === 2) await fullBoard(page, viewport, 'risk-stop-flow', label);
  if (step === 3) await fullBoard(page, viewport, 'risk-stop-gap', label);
  if (step === 4) await fullBoard(page, viewport, 'risk-stop-not-wall', label);
}

async function assertDiversification(page, viewport, step, label) {
  if (step === 1) await fullBoard(page, viewport, 'risk-div-one-source', label);
  if (step === 2) await fullBoard(page, viewport, 'risk-div-sources', label);
  if (step === 3) await fullBoard(page, viewport, 'risk-div-same-event', label);
  if (step === 4) await pair(page, viewport, 'risk-div-many-names', 'risk-div-different-risk', label);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    for (const lesson of lessons) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const diagnostics = [];
      page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
      page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));

      await openRiskLesson(page, lesson.title);
      const first = await page.getByText(/Adım 1\//).innerText();
      const total = Number(first.match(/\/(\d+)/)?.[1] ?? 1);

      for (let step = 1; step <= total; step += 1) {
        const label = `risk-${viewport.name}-${lesson.key}-step-${step}`;
        await noOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible risk visual found`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too small at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * lesson.maxHeightRatio) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);

        if (lesson.key === 'uncertainty') await assertUncertainty(page, viewport, step, label);
        if (lesson.key === 'volatility') await assertVolatility(page, viewport, step, label);
        if (lesson.key === 'size') await assertSize(page, viewport, step, label);
        if (lesson.key === 'reward') await assertReward(page, viewport, step, label);
        if (lesson.key === 'stop') await assertStop(page, viewport, step, label);
        if (lesson.key === 'diversification') await assertDiversification(page, viewport, step, label);

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
      console.log(`${viewport.name}/${lesson.key}: ${total}/${total} risk responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}
