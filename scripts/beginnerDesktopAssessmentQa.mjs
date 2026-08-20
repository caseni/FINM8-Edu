import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${overflow.page}px > ${overflow.viewport}px`);
  }
}

async function capture(page, label) {
  await assertNoHorizontalOverflow(page, label);
  await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
}

async function openPriceFormationLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Piyasalar Nasıl Çalışır/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Bir fiyat nasıl ortaya çıkar/i }).click();
  await page.getByText(/Adım 1\//).waitFor();
}

async function advanceLessonToTask(page) {
  const firstStepText = await page.getByText(/Adım 1\//).innerText();
  const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);
  if (totalSteps < 1) throw new Error('Desktop assessment QA could not resolve lesson step count.');

  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: /Göreve geç/i }).click();
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => {
    if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
  });

  await openPriceFormationLesson(page);
  await advanceLessonToTask(page);

  await page.getByText('ÖNCE SEN ÇÖZ', { exact: true }).waitFor();
  await capture(page, 'beginner-desktop-assessment-task-start');

  await page.getByText('Şirketin her dakika yeni fiyat seçmesi', { exact: true }).click();
  await page.getByRole('button', { name: 'Kontrol et' }).click();
  await page.getByText('Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.', { exact: true }).waitFor();
  await capture(page, 'beginner-desktop-assessment-task-wrong');

  await page.getByRole('button', { name: 'Tekrar dene' }).click();
  await page.getByText('ÖNCE SEN ÇÖZ', { exact: true }).waitFor();
  await page.getByText('Alıcı ve satıcının aynı fiyatta buluşması', { exact: true }).click();
  await page.getByRole('button', { name: 'Kontrol et' }).click();
  await page.getByText('Doğru. Seçimin senaryodaki kanıtlarla uyumlu.', { exact: true }).waitFor();
  await capture(page, 'beginner-desktop-assessment-task-correct');

  await page.getByRole('button', { name: /Quiz’e geç/i }).click();
  await page.getByText('MİNİ QUIZ', { exact: true }).waitFor();
  await page.getByText('Bir işlem ne zaman oluşur?', { exact: true }).waitFor();
  await capture(page, 'beginner-desktop-assessment-quiz-start');

  await page.getByText('Şirket yeni fiyat yazdığında', { exact: true }).click();
  await page.getByRole('button', { name: 'Cevabı kontrol et' }).click();
  await page.getByText('Bu kez değil', { exact: true }).waitFor();
  await capture(page, 'beginner-desktop-assessment-quiz-feedback');

  if (diagnostics.length > 0) {
    throw new Error(`Desktop beginner assessment diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Desktop beginner assessment: task + quiz feedback PASS');
} finally {
  await browser.close();
}
