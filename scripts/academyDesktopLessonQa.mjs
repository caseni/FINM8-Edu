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

async function openAcademyMarketLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).click();
  await page.getByRole('button', { name: /^Borsa ne işe yarar\?$/i }).click();
  await page.getByText(/Adım 1\//).waitFor();
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

  await openAcademyMarketLesson(page);
  const firstStepText = await page.getByText(/Adım 1\//).innerText();
  const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);
  if (totalSteps < 1) throw new Error('Academy desktop lesson QA could not resolve lesson step count.');

  for (let step = 1; step <= totalSteps; step += 1) {
    const label = `academy-desktop-markets-exchange-step-${String(step).padStart(2, '0')}`;
    await assertNoHorizontalOverflow(page, label);
    await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
    if (step < totalSteps) {
      await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
      await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
    }
  }

  if (diagnostics.length > 0) {
    throw new Error(`Academy desktop lesson diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log(`Academy desktop markets lesson: ${totalSteps}/${totalSteps} steps PASS`);
} finally {
  await browser.close();
}
