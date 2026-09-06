import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const tracks = [
  'Ekonomiyi Anla',
  'Piyasaları Anla',
  'Grafikleri Derinleştir',
  'Şirketleri Anla',
  'Risk ve Portföy',
  'Karar Psikolojisi',
  'Yöntemler ve Planlar',
  'Sistematik ve Sayısal Yaklaşımlar',
  'İleri Grafik Yaklaşımları',
  'Varlık Türlerini Anla',
];

const slug = (value) => value
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ı/g, 'i')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${overflow.page}px > ${overflow.viewport}px`);
  }
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

async function firstLessonButton(page, trackTitle) {
  const before = new Set(await buttonNames(page));
  const escaped = trackTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.getByRole('button', { name: new RegExp(`^${escaped} derslerini aç$`, 'i') }).click();
  await page.waitForTimeout(150);
  const after = await buttonNames(page);
  const nextActionPattern = /^(Derse başla|Derse devam et|Göreve devam et|Quiz’e devam et):/i;
  const firstLessonName = after.find((name) => (
    !before.has(name)
    && !/derslerini kapat$/i.test(name)
    && !nextActionPattern.test(name)
    && !/· Devam ·/i.test(name)
  ));
  if (!firstLessonName) throw new Error(`No first lesson found for ${trackTitle}`);
  return firstLessonName;
}

async function captureTrack(page, trackTitle) {
  await openAcademy(page);
  const lessonButton = await firstLessonButton(page, trackTitle);
  const prefix = `academy-continuation-${slug(trackTitle)}`;
  await page.getByRole('button', { name: lessonButton, exact: true }).click();

  for (let step = 1; step <= 5; step += 1) {
    await page.getByText(new RegExp(`Adım ${step}/`)).waitFor();
    await assertNoHorizontalOverflow(page, `${prefix}-step-${String(step).padStart(2, '0')}`);
    await page.screenshot({
      path: `visual-qa/${prefix}-step-${String(step).padStart(2, '0')}.png`,
      fullPage: true,
    });
    if (step < 5) {
      const continueButton = page.getByRole('button', { name: /Sonraki adıma geç/i });
      await continueButton.click();
      await page.waitForTimeout(80);
    }
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const trackTitle of tracks) {
    await captureTrack(page, trackTitle);
  }
} finally {
  await browser.close();
}
