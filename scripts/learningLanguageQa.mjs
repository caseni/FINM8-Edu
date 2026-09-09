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

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => {
    if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await assertNoHorizontalOverflow(page, 'language-tr-initial');

  const english = page.getByRole('button', { name: 'İngilizce dilini seç', exact: true });
  await english.waitFor();
  await english.click();
  await page.getByText('Start Learning', { exact: true }).waitFor();
  await page.getByText('Start with the basics, then progress through four sections', { exact: true }).waitFor();
  await page.getByText('26 short lessons · learn at your pace', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'language-en-selected');

  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Start Learning', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Select Turkish', exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'language-en-persisted');

  await page.getByRole('button', { name: 'Select Turkish', exact: true }).click();
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'İngilizce dilini seç', exact: true }).waitFor();

  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'language-tr-restored');

  if (diagnostics.length > 0) {
    throw new Error(`Learning language diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Learning language: TR -> EN -> reload persists -> TR -> reload persists + 360px overflow PASS');
} finally {
  await browser.close();
}
