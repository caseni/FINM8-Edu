import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const trackTitle = process.argv.slice(2).join(' ').trim();
if (!trackTitle) throw new Error('academyTrackResponsiveQa requires an Academy track title argument.');

const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];
const MAX_VISUAL_WORDS = 24;
const MAX_SUMMARY_VISUAL_WORDS = 18;
const SUMMARY_REPETITION_THRESHOLD = 0.78;
const MAX_MOBILE_VISUAL_TO_ACTION_GAP = 220;
const MAX_MOBILE_SAFETY_TO_ACTION_GAP = 120;

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const escapedTrack = trackTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const openPattern = new RegExp(`^${escapedTrack} derslerini aç$`, 'i');

function wordCount(value) {
  const clean = value.trim().replace(/\s+/g, ' ');
  return clean ? clean.split(' ').length : 0;
}

function normalizedTokens(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9çğıöşü\s]/gi, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function sharedTokenRatio(left, right) {
  const leftTokens = normalizedTokens(left);
  const rightTokens = normalizedTokens(right);
  if (leftTokens.length < 5 || rightTokens.length < 5) return 0;
  const rightSet = new Set(rightTokens);
  const shared = new Set(leftTokens.filter((token) => rightSet.has(token))).size;
  return shared / Math.min(new Set(leftTokens).size, new Set(rightTokens).size);
}

async function openAcademy(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
}

async function buttonNames(page) {
  return page.getByRole('button').evaluateAll((buttons) =>
    buttons
      .map((button) => button.getAttribute('aria-label') || button.textContent || '')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

async function discoverLessonTitles(page) {
  await openAcademy(page);
  const before = new Set(await buttonNames(page));
  await page.getByRole('button', { name: openPattern }).click();
  await page.waitForTimeout(180);
  const after = await buttonNames(page);
  const nextActionPattern = /^(Derse başla|Derse devam et|Göreve devam et|Quiz’e devam et):/i;
  const titles = after.filter((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (titles.length !== 12) throw new Error(`Expected 12 ${trackTitle} lessons, found ${titles.length}: ${titles.join(' | ')}`);
  return titles;
}

async function openLesson(page, title) {
  await openAcademy(page);
  await page.getByRole('button', { name: openPattern }).click();
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
    if (box && (!largest || box.width * box.height > largest.width * largest.height)) {
      largest = {
        ...box,
        text: (await image.innerText()).trim(),
      };
    }
  }
  return largest;
}

async function takeawayText(page) {
  const marker = page.getByText('AKLINDA KALSIN', { exact: true });
  if (await marker.count() === 0) return '';
  return marker.evaluate((node) => {
    const parent = node.parentElement;
    if (!parent) return '';
    const children = Array.from(parent.children);
    const markerIndex = children.indexOf(node);
    return children[markerIndex + 1]?.textContent?.trim() ?? '';
  });
}

async function assertVisualTeachingCopy(page, visual, label, step, total) {
  const visualWords = wordCount(visual.text);
  if (visualWords > MAX_VISUAL_WORDS) {
    throw new Error(`${label}: visual carries ${visualWords} visible words; Academy visual budget is ${MAX_VISUAL_WORDS}`);
  }
  if (step !== total) return;
  if (visualWords > MAX_SUMMARY_VISUAL_WORDS) {
    throw new Error(`${label}: summary visual carries ${visualWords} visible words; summary budget is ${MAX_SUMMARY_VISUAL_WORDS}`);
  }

  const takeaway = await takeawayText(page);
  const repetition = sharedTokenRatio(visual.text, takeaway);
  if (repetition >= SUMMARY_REPETITION_THRESHOLD) {
    throw new Error(`${label}: summary visual repeats the takeaway too closely (overlap ${repetition.toFixed(2)})`);
  }
}

async function assertMobileVerticalBalance(page, visual, label, step, total) {
  const primaryAction = page.getByRole('button', {
    name: step === total ? 'Göreve geç' : 'Sonraki adıma geç',
  });
  const actionBox = await primaryAction.boundingBox();
  if (!actionBox) throw new Error(`${label}: primary lesson action is not measurable`);

  const visualGap = actionBox.y - (visual.y + visual.height);
  if (visualGap > MAX_MOBILE_VISUAL_TO_ACTION_GAP) {
    throw new Error(`${label}: ${visualGap.toFixed(1)}px dead zone below the teaching visual; mobile budget is ${MAX_MOBILE_VISUAL_TO_ACTION_GAP}px`);
  }

  if (step !== total) return;
  const safetyLabel = page.getByText('EĞİTİM NOTU', { exact: true });
  await safetyLabel.waitFor();
  const safetyBox = await safetyLabel.evaluate((node) => {
    const parent = node.parentElement;
    if (!parent) return null;
    const rect = parent.getBoundingClientRect();
    return { y: rect.y, height: rect.height };
  });
  if (!safetyBox) throw new Error(`${label}: summary educational note is not measurable`);
  const safetyGap = actionBox.y - (safetyBox.y + safetyBox.height);
  if (safetyGap > MAX_MOBILE_SAFETY_TO_ACTION_GAP) {
    throw new Error(`${label}: ${safetyGap.toFixed(1)}px dead zone below the summary note; mobile budget is ${MAX_MOBILE_SAFETY_TO_ACTION_GAP}px`);
  }
}

async function assertNoOverflow(page, label) {
  const d = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (d.page > d.viewport + 1) throw new Error(`${label}: horizontal overflow ${d.page}px > ${d.viewport}px`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  for (const viewport of viewports) {
    const discovery = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const lessonTitles = await discoverLessonTitles(discovery);
    await discovery.close();

    for (const title of lessonTitles) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const diagnostics = [];
      page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
      page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
      page.on('response', (response) => {
        if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
      });

      await openLesson(page, title);
      const stepText = await page.getByText(/Adım 1\//).innerText();
      const total = Number(stepText.match(/\/(\d+)/)?.[1] ?? 1);
      if (total !== 5) throw new Error(`${viewport.name}/${trackTitle}/${title}: expected 5 steps, got ${total}`);

      for (let step = 1; step <= total; step += 1) {
        const label = `academy-${slug(trackTitle)}-${viewport.name}-${slug(title)}-step-${step}`;
        await assertNoOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible lesson visual`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too narrow at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.75) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);
        if (viewport.name === 'mobile-390') {
          await assertVisualTeachingCopy(page, visual, label, step, total);
          await assertMobileVerticalBalance(page, visual, label, step, total);
        }

        if (step === 1 || step === 3 || step === total) {
          await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        }
        if (step < total) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor();
        }
      }

      if (diagnostics.length) throw new Error(`${viewport.name}/${trackTitle}/${title} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${trackTitle}/${title}: ${total}/${total} responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}
