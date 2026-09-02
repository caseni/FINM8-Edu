import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (dimensions.page > dimensions.viewport + 1) {
    throw new Error(`${label}: horizontal overflow ${dimensions.page}px > ${dimensions.viewport}px`);
  }
}

async function runSearchFlow(page, label) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: 'Konu ara', exact: true }).click();
  await page.getByText('Merak ettiğin kavrama doğrudan git.', { exact: true }).waitFor();
  await noOverflow(page, `${label}-landing`);

  const input = page.getByRole('textbox', { name: 'Finans konusu ara' });
  await input.fill('faiz');
  await page.getByText('SONUÇLAR', { exact: true }).waitFor();

  const firstResult = page.getByRole('button', { name: /Faiz neyi etkiler/i }).first();
  await firstResult.waitFor();
  const resultCountText = (await page.getByText(/ders$/).first().innerText()).trim();
  if (!/\d+ ders/.test(resultCountText)) {
    throw new Error(`${label}: search result count is not visible -> ${resultCountText}`);
  }

  await noOverflow(page, `${label}-results`);
  await page.screenshot({ path: `visual-qa/search-${label}.png`, fullPage: true });

  await firstResult.click();
  await page.getByText(/Adım 1\//).waitFor();
  await noOverflow(page, `${label}-lesson`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await runSearchFlow(mobile, 'mobile-390');
  await mobile.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await runSearchFlow(desktop, 'desktop');
  await desktop.close();

  console.log('FINM8 EDU topic search: mobile + desktop + result routing PASS');
} finally {
  await browser.close();
}
