import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';

async function openPriceFormationTask(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Piyasalar Nasıl Çalışır/i }).first().click();
  await page.getByText('BAŞLANGIÇ · 6 KISA DERS', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Bir fiyat nasıl ortaya çıkar/i }).click();
  await page.getByText(/Adım 1\//).waitFor();

  const firstStepText = await page.getByText(/Adım 1\//).innerText();
  const totalSteps = Number(firstStepText.match(/\/(\d+)/)?.[1] ?? 1);
  for (let step = 1; step < totalSteps; step += 1) {
    await page.getByRole('button', { name: /Sonraki adıma geç/i }).click();
    await page.getByText(new RegExp(`Adım ${step + 1}\\/${totalSteps}`)).waitFor();
  }
  await page.getByRole('button', { name: /Göreve geç/i }).click();
  await page.getByText('Alıcı ve satıcının aynı fiyatta buluşması', { exact: true }).waitFor();
}

async function feedbackGeometry(page) {
  return page.evaluate(() => {
    const candidates = [...document.querySelectorAll('*')]
      .filter((node) => {
        const style = window.getComputedStyle(node);
        return node.scrollHeight > node.clientHeight + 12
          && (style.overflowY === 'auto' || style.overflowY === 'scroll');
      })
      .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight));

    const scrollable = candidates[0];
    if (!scrollable) return null;
    const scrollRect = scrollable.getBoundingClientRect();
    const visuals = [...scrollable.querySelectorAll('[role="img"]')]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          area: rect.width * rect.height,
        };
      })
      .filter((rect) => rect.width >= 160 && rect.height >= 120)
      .sort((a, b) => b.area - a.area);

    return {
      scrollTop: scrollable.scrollTop,
      maxScrollTop: scrollable.scrollHeight - scrollable.clientHeight,
      scrollTopEdge: scrollRect.top,
      scrollBottomEdge: scrollRect.bottom,
      visual: visuals[0] ?? null,
    };
  });
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

  await openPriceFormationTask(page);
  await page.getByText('Alıcı ve satıcının aynı fiyatta buluşması', { exact: true }).click();
  await page.getByRole('button', { name: 'Kontrol et' }).click();
  await page.getByText('Doğru. Seçimin senaryodaki kanıtlarla uyumlu.', { exact: true }).waitFor();
  await page.waitForTimeout(220);

  const quizButton = page.getByRole('button', { name: 'Quiz’e geç' });
  if (!(await quizButton.isVisible())) throw new Error('Task feedback QA: Quiz’e geç button is not visible after a correct answer.');

  const geometry = await feedbackGeometry(page);
  if (!geometry) throw new Error('Task feedback QA: no vertical task ScrollView found.');
  if (geometry.maxScrollTop > 40 && geometry.scrollTop < Math.min(40, geometry.maxScrollTop * 0.25)) {
    throw new Error(`Task feedback QA: feedback did not auto-reveal (scrollTop ${geometry.scrollTop.toFixed(1)} / ${geometry.maxScrollTop.toFixed(1)}).`);
  }
  if (!geometry.visual) throw new Error('Task feedback QA: reinforcement visual is not rendered after answer check.');
  if (geometry.visual.top >= geometry.scrollBottomEdge - 24) {
    throw new Error(`Task feedback QA: reinforcement visual starts below the visible ScrollView (${geometry.visual.top.toFixed(1)} >= ${geometry.scrollBottomEdge.toFixed(1)}).`);
  }
  if (geometry.visual.bottom > geometry.scrollBottomEdge + 4) {
    throw new Error(`Task feedback QA: reinforcement visual remains clipped below the task viewport (${geometry.visual.bottom.toFixed(1)} > ${geometry.scrollBottomEdge.toFixed(1)}).`);
  }

  await page.screenshot({ path: 'visual-qa/beginner-task-feedback-auto-reveal.png', fullPage: true });

  if (diagnostics.length > 0) throw new Error(`Task feedback diagnostics:\n${diagnostics.join('\n')}`);
  console.log(`Beginner task feedback auto-reveal: PASS (scrollTop ${geometry.scrollTop.toFixed(1)} / ${geometry.maxScrollTop.toFixed(1)})`);
} finally {
  await browser.close();
}
