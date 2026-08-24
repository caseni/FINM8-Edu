import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const trackTitle = 'Piyasaları Anla';
const viewports = [
  { name: 'mobile-360', sizeClass: 'mobile', width: 360, height: 800, minVisualWidth: 220 },
  { name: 'mobile-390', sizeClass: 'mobile', width: 390, height: 844, minVisualWidth: 240 },
  { name: 'desktop', sizeClass: 'desktop', width: 1440, height: 900, minVisualWidth: 300 },
];

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

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
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).click();
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
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).click();
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
      if (total !== 5) throw new Error(`${viewport.name}/${title}: expected 5 steps, got ${total}`);

      for (let step = 1; step <= total; step += 1) {
        const label = `academy-markets-${viewport.name}-${slug(title)}-step-${step}`;
        await assertNoOverflow(page, label);
        const visual = await largestImage(page);
        if (!visual) throw new Error(`${label}: no visible lesson visual`);
        if (visual.width < viewport.minVisualWidth) throw new Error(`${label}: visual too narrow at ${visual.width.toFixed(1)}px`);
        if (visual.width > (viewport.sizeClass === 'mobile' ? 360 : 700) + 1) throw new Error(`${label}: visual too wide at ${visual.width.toFixed(1)}px`);
        if (visual.x < -1 || visual.x + visual.width > viewport.width + 1) throw new Error(`${label}: visual escapes viewport`);
        if (visual.height > viewport.height * 0.75) throw new Error(`${label}: visual too tall at ${visual.height.toFixed(1)}px`);

        if (step === 1 || step === 3 || step === total) {
          await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
        }
        if (step < total) {
          await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
          await page.getByText(new RegExp(`Adım ${step + 1}\\/${total}`)).waitFor();
        }
      }

      if (diagnostics.length) throw new Error(`${viewport.name}/${title} diagnostics:\n${diagnostics.join('\n')}`);
      await page.close();
      console.log(`${viewport.name}/${title}: ${total}/${total} Academy markets responsive steps PASS`);
    }
  }
} finally {
  await browser.close();
}