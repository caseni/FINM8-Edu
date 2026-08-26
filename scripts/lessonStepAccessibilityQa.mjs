import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const sectionTitle = 'Para ve Ekonomi';
const lessonTitle = 'Aynı para neden zamanla daha az şey alır?';
const lessonTitleSearch = /Aynı para neden zamanla daha az şey alır/i;

async function assertStep(page, step, total) {
  const separator = /[.!?]$/.test(lessonTitle.trim()) ? ' ' : '. ';
  const expectedLabel = `${lessonTitle}${separator}Adım ${step}/${total}.`;
  const liveStep = page.getByRole('status', { name: expectedLabel });
  if ((await liveStep.count()) === 0) {
    const visibleStep = page.getByText(`Adım ${step}/${total}`, { exact: true });
    await visibleStep.waitFor();
    const diagnostic = await visibleStep.evaluate((element) => {
      const chain = [];
      let current = element;
      for (let depth = 0; current && depth < 4; depth += 1) {
        chain.push(current.outerHTML);
        current = current.parentElement;
      }
      return chain.join('\n--- parent ---\n');
    });
    throw new Error(`Lesson step status missing for "${expectedLabel}". Rendered DOM:\n${diagnostic}`);
  }
  await liveStep.waitFor();

  const role = await liveStep.getAttribute('role');
  if (role !== 'status') {
    throw new Error(`Lesson step status role mismatch -> expected status, got ${role ?? 'missing'}`);
  }

  const visibleStep = (await liveStep.innerText()).trim();
  if (!visibleStep.includes(`Adım ${step}/${total}`)) {
    throw new Error(`Lesson step visible copy mismatch -> expected Adım ${step}/${total}, got "${visibleStep}"`);
  }

  const progress = page.getByRole('progressbar', { name: 'Ders ilerlemesi' });
  await progress.waitFor();
  const now = await progress.getAttribute('aria-valuenow');
  if (now !== String(step)) {
    throw new Error(`Lesson progressbar mismatch -> expected aria-valuenow=${step}, got ${now ?? 'missing'}`);
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`[pageerror] ${error.stack || error.message}`));
  page.on('requestfailed', (request) => diagnostics.push(`[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`));
  page.on('response', (response) => {
    if (response.status() >= 500) diagnostics.push(`[response:${response.status()}] ${response.url()}`);
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: new RegExp(sectionTitle, 'i') }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: lessonTitleSearch }).click();

  const stepText = page.getByText(/Adım 1\//);
  await stepText.waitFor();
  const total = Number((await stepText.innerText()).match(/\/(\d+)/)?.[1] ?? 0);
  if (!Number.isFinite(total) || total < 2) throw new Error(`Invalid lesson step count: ${total}`);

  await assertStep(page, 1, total);
  await page.getByRole('button', { name: 'Sonraki adıma geç', exact: true }).click();
  await assertStep(page, 2, total);
  await page.getByRole('button', { name: 'Önceki adıma dön', exact: true }).click();
  await assertStep(page, 1, total);

  if (diagnostics.length > 0) {
    throw new Error(`Lesson step accessibility diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log(`Lesson step accessibility: status 1/${total} -> 2/${total} -> 1/${total} + progressbar PASS`);
} finally {
  await browser.close();
}
