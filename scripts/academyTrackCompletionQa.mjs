import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const root = process.cwd();
const marketLessonFiles = [
  'src/domain/learning/examples/academy/financialMarketsFoundationLessons.ts',
  'src/domain/learning/examples/academy/financialMarketsExpansionLessons.ts',
];

function academyLessonIds(files) {
  const ids = [];
  for (const relativePath of files) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    const regex = /\bid:\s*['"](lesson\.[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(source))) ids.push(match[1]);
  }
  return Array.from(new Set(ids));
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow.page > overflow.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${overflow.page}px > ${overflow.viewport}px`);
  }
}

const marketLessonIds = academyLessonIds(marketLessonFiles);
if (marketLessonIds.length !== 12) {
  throw new Error(`Expected 12 Financial Markets Academy lessons, found ${marketLessonIds.length}`);
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
  await page.evaluate(({ key, lessonIds }) => {
    const existing = window.localStorage.getItem(key);
    const persisted = existing ? JSON.parse(existing) : { state: {}, version: 0 };
    const previous = Array.isArray(persisted.state?.completedLessonIds)
      ? persisted.state.completedLessonIds
      : [];
    window.localStorage.setItem(key, JSON.stringify({
      ...persisted,
      version: persisted.version ?? 0,
      state: {
        ...(persisted.state ?? {}),
        completedLessonIds: Array.from(new Set([...previous, ...lessonIds])),
      },
    }));
  }, { key: progressKey, lessonIds: marketLessonIds });
  await page.reload({ waitUntil: 'networkidle' });

  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Finansı konu konu derinleştir.', { exact: true }).waitFor();

  const marketTrack = page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i });
  await marketTrack.click();
  await page.getByText('12/12 ders', { exact: true }).waitFor();
  await page.getByText('100%', { exact: true }).waitFor();
  await page.getByText('TAMAMLANDI', { exact: true }).waitFor();
  await page.getByText('OKUL TAMAMLANDI', { exact: true }).waitFor();
  await page.getByText(/Academy doğrusal değil/i).waitFor();
  const exploreOtherSubjects = page.getByRole('button', { name: 'Diğer Academy alanlarına göz at', exact: true });
  await exploreOtherSubjects.waitFor();
  await assertNoHorizontalOverflow(page, 'academy-school-complete-expanded');
  await page.screenshot({ path: 'visual-qa/academy-school-complete-expanded.png', fullPage: true });

  await exploreOtherSubjects.click();
  await page.getByRole('button', { name: /^Piyasaları Anla derslerini aç$/i }).waitFor();
  if (await page.getByText('OKUL TAMAMLANDI', { exact: true }).count()) {
    throw new Error('Completed Academy school did not collapse after choosing other subjects.');
  }
  await page.getByText('TAMAMLANDI', { exact: true }).waitFor();
  await assertNoHorizontalOverflow(page, 'academy-school-complete-collapsed');
  await page.screenshot({ path: 'visual-qa/academy-school-complete-collapsed.png', fullPage: true });

  if (diagnostics.length > 0) {
    throw new Error(`Academy school completion diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Academy school completion: 12/12 -> TAMAMLANDI -> other subjects PASS');
} finally {
  await browser.close();
}
