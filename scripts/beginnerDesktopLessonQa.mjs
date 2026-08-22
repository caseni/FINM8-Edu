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

async function assertLessonVisualClearsBottomCta(page, label) {
  const geometry = await page.evaluate(() => {
    const visibleRects = (selector) => [...document.querySelectorAll(selector)]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return {
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          area: rect.width * rect.height,
          visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
        };
      })
      .filter((item) => item.visible);

    const visual = visibleRects('[role="img"]')
      .filter((item) => item.width >= 180 && item.height >= 140)
      .sort((a, b) => b.area - a.area)[0];

    const bottomCta = visibleRects('button, [role="button"]')
      .filter((item) => item.width >= window.innerWidth * 0.35 && item.top >= window.innerHeight * 0.55)
      .sort((a, b) => b.width - a.width || b.top - a.top)[0];

    return visual && bottomCta
      ? { visualBottom: visual.bottom, ctaTop: bottomCta.top, gap: bottomCta.top - visual.bottom }
      : null;
  });

  if (geometry && geometry.gap < 8) {
    throw new Error(`${label}: lesson visual overlaps bottom CTA (gap ${geometry.gap.toFixed(1)}px)`);
  }
}

async function openPriceFormationLesson(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Piyasalar Nasıl Çalışır/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Bir fiyat nasıl ortaya çıkar/i }).click();
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

  await openPriceFormationLesson(page);
  const firstStepText = await page.getByText(/Adım 1\//).innerText();
  const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);
  if (totalSteps < 1) throw new Error('Desktop lesson QA could not resolve lesson step count.');

  for (let step = 1; step <= totalSteps; step += 1) {
    const label = `beginner-desktop-price-formation-step-${String(step).padStart(2, '0')}`;
    await assertNoHorizontalOverflow(page, label);
    await assertLessonVisualClearsBottomCta(page, label);
    await page.screenshot({ path: `visual-qa/${label}.png`, fullPage: true });
    if (step < totalSteps) {
      await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
      await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
    }
  }

  if (diagnostics.length > 0) {
    throw new Error(`Desktop beginner lesson diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log(`Desktop beginner lesson: ${totalSteps}/${totalSteps} steps PASS`);
} finally {
  await browser.close();
}
