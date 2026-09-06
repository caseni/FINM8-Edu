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

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobile.getByTestId('learn-home-screen').waitFor();
  const nav = mobile.getByRole('tablist', { name: 'FINM8 EDU ana gezinme' });
  await nav.waitFor();

  const learnTab = mobile.getByRole('tab', { name: 'Öğren', exact: true });
  const searchTab = mobile.getByRole('tab', { name: 'Ara', exact: true });
  const academyTab = mobile.getByRole('tab', { name: 'Academy', exact: true });

  if ((await learnTab.getAttribute('aria-selected')) !== 'true') {
    throw new Error('Mobile hub nav: Learn tab is not selected on home');
  }

  await searchTab.click();
  await mobile.getByRole('textbox', { name: 'Finans konusu ara' }).waitFor();
  if ((await mobile.getByRole('tab', { name: 'Ara', exact: true }).getAttribute('aria-selected')) !== 'true') {
    throw new Error('Mobile hub nav: Search tab is not selected on search');
  }
  await noOverflow(mobile, 'hub-search');

  await mobile.getByRole('tab', { name: 'Academy', exact: true }).click();
  await mobile.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();
  if ((await mobile.getByRole('tab', { name: 'Academy', exact: true }).getAttribute('aria-selected')) !== 'true') {
    throw new Error('Mobile hub nav: Academy tab is not selected on Academy');
  }
  await noOverflow(mobile, 'hub-academy');
  await mobile.screenshot({ path: 'visual-qa/hub-nav-mobile-390.png', fullPage: true });

  await mobile.getByRole('tab', { name: 'Öğren', exact: true }).click();
  await mobile.getByTestId('learn-home-screen').waitFor();
  await noOverflow(mobile, 'hub-home');
  await mobile.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(baseUrl, { waitUntil: 'networkidle' });
  await desktop.getByTestId('learn-home-screen').waitFor();
  if (await desktop.getByRole('tablist', { name: 'FINM8 EDU ana gezinme' }).count()) {
    throw new Error('Desktop hub nav should stay hidden at desktop width');
  }
  await desktop.close();

  console.log('FINM8 EDU mobile hub navigation: Home -> Search -> Academy -> Home PASS');
} finally {
  await browser.close();
}
