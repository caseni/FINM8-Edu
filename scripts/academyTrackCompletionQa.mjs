import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = 'http://127.0.0.1:4173/';
const progressKey = '@finm8_edu_progress_v1';
const root = process.cwd();

const tracks = [
  {
    title: 'Ekonomiyi Anla',
    files: [
      'src/domain/learning/examples/academy/economyFoundationsLessons.ts',
      'src/domain/learning/examples/academy/economyExpansionLessons.ts',
    ],
  },
  {
    title: 'Piyasaları Anla',
    files: [
      'src/domain/learning/examples/academy/financialMarketsFoundationLessons.ts',
      'src/domain/learning/examples/academy/financialMarketsExpansionLessons.ts',
    ],
  },
  {
    title: 'Grafikleri Derinleştir',
    files: [
      'src/domain/learning/examples/academy/technicalAnalysisFoundationLessons.ts',
      'src/domain/learning/examples/academy/technicalAnalysisExpansionLessons.ts',
    ],
  },
  {
    title: 'Şirketleri Anla',
    files: [
      'src/domain/learning/examples/academy/fundamentalAnalysisFoundationLessons.ts',
      'src/domain/learning/examples/academy/fundamentalAnalysisExpansionLessons.ts',
    ],
  },
  {
    title: 'Risk ve Portföy',
    files: [
      'src/domain/learning/examples/academy/riskPortfolioFoundationLessons.ts',
      'src/domain/learning/examples/academy/riskPortfolioExpansionLessons.ts',
    ],
  },
  {
    title: 'Karar Psikolojisi',
    files: [
      'src/domain/learning/examples/academy/marketPsychologyFoundationLessons.ts',
      'src/domain/learning/examples/academy/marketPsychologyExpansionLessons.ts',
    ],
  },
  {
    title: 'Yöntemler ve Planlar',
    files: [
      'src/domain/learning/examples/academy/strategyFoundationLessons.ts',
      'src/domain/learning/examples/academy/strategyExpansionLessons.ts',
    ],
  },
  {
    title: 'Sistematik ve Sayısal Yaklaşımlar',
    files: [
      'src/domain/learning/examples/academy/algoQuantFoundationLessons.ts',
      'src/domain/learning/examples/academy/algoQuantExpansionLessons.ts',
    ],
  },
  {
    title: 'İleri Grafik Yaklaşımları',
    files: [
      'src/domain/learning/examples/academy/smcIctFoundationLessons.ts',
      'src/domain/learning/examples/academy/smcIctExpansionLessons.ts',
    ],
  },
  {
    title: 'Varlık Türlerini Anla',
    files: [
      'src/domain/learning/examples/academy/assetSchoolFoundationLessons.ts',
      'src/domain/learning/examples/academy/assetSchoolExpansionLessons.ts',
    ],
  },
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

function slug(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
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

async function seedCompletedLessons(page, lessonIds) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(({ key, ids }) => {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, JSON.stringify({
      version: 0,
      state: {
        completedLessonIds: ids,
      },
    }));
  }, { key: progressKey, ids: lessonIds });
  await page.reload({ waitUntil: 'networkidle' });
}

async function openAcademy(page) {
  await page.getByText('Öğrenmeye Başla', { exact: true }).waitFor();
  await page.getByRole('button', { name: /İleri konular/i }).click();
  await page.getByText('Academy', { exact: true }).first().waitFor();
}

for (const track of tracks) {
  const lessonIds = academyLessonIds(track.files);
  if (lessonIds.length !== 12) {
    throw new Error(`Expected 12 Academy lessons for ${track.title}, found ${lessonIds.length}`);
  }
}

const allAcademyLessonIds = Array.from(new Set(tracks.flatMap((track) => academyLessonIds(track.files))));
if (allAcademyLessonIds.length !== 120) {
  throw new Error(`Expected 120 Academy lessons across ten schools, found ${allAcademyLessonIds.length}`);
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

  for (const track of tracks) {
    const lessonIds = academyLessonIds(track.files);
    await seedCompletedLessons(page, lessonIds);
    await openAcademy(page);

    const collapsedTrackButton = page.getByRole('button', { name: new RegExp(`^${track.title} derslerini aç$`, 'i') });
    await collapsedTrackButton.click();
    const expandedTrackButton = page.getByRole('button', { name: new RegExp(`^${track.title} derslerini kapat$`, 'i') });
    await expandedTrackButton.waitFor();
    await expandedTrackButton.getByText('12/12 ders', { exact: true }).waitFor();
    await expandedTrackButton.getByText('100%', { exact: true }).waitFor();
    await expandedTrackButton.getByText('TAMAMLANDI', { exact: true }).waitFor();
    await page.getByText('OKUL TAMAMLANDI', { exact: true }).waitFor();
    await page.getByText(/Academy doğrusal değil/i).waitFor();

    const exploreOtherSubjects = page.getByRole('button', { name: 'Diğer Academy alanlarına göz at', exact: true });
    await exploreOtherSubjects.waitFor();
    await exploreOtherSubjects.scrollIntoViewIfNeeded();
    await assertNoHorizontalOverflow(page, `academy-school-complete-${slug(track.title)}-expanded`);

    if (track.title === 'Piyasaları Anla') {
      await page.screenshot({ path: 'visual-qa/academy-school-complete-expanded.png', fullPage: true });
    }

    await exploreOtherSubjects.click();
    await collapsedTrackButton.waitFor();
    if (await page.getByText('OKUL TAMAMLANDI', { exact: true }).count()) {
      throw new Error(`${track.title}: completed Academy school did not collapse after choosing other subjects.`);
    }
    await collapsedTrackButton.getByText('TAMAMLANDI', { exact: true }).waitFor();
    await assertNoHorizontalOverflow(page, `academy-school-complete-${slug(track.title)}-collapsed`);
    console.log(`${track.title}: 12/12 -> TAMAMLANDI -> other subjects PASS`);
  }

  await seedCompletedLessons(page, allAcademyLessonIds);
  await openAcademy(page);
  await page.getByText('ACADEMY TAMAM', { exact: true }).waitFor();
  await page.getByText('İleri öğrenme yolunu tamamladın.', { exact: true }).waitFor();
  await page.getByText('120/120 ders · 10/10 okul', { exact: true }).waitFor();
  await page.getByText('Tamamladığın okullar', { exact: true }).waitFor();
  if (await page.getByText('NEREDEN DEVAM EDEBİLİRSİN?', { exact: true }).count()) {
    throw new Error('120/120 Academy completion should hide the starter direction guide.');
  }
  for (const track of tracks) {
    const trackButton = page.getByRole('button', { name: new RegExp(`^${track.title} derslerini aç$`, 'i') });
    await trackButton.waitFor();
    await trackButton.getByText('TAMAMLANDI', { exact: true }).waitFor();
  }
  await assertNoHorizontalOverflow(page, 'academy-all-schools-complete');
  await page.screenshot({ path: 'visual-qa/academy-all-schools-complete.png', fullPage: true });

  if (diagnostics.length > 0) {
    throw new Error(`Academy school completion diagnostics:\n${diagnostics.join('\n')}`);
  }
  console.log('Academy school completion: all 10 schools + 120/120 aggregate hero PASS');
} finally {
  await browser.close();
}
