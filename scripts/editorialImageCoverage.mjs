import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registries = [
  'src/components/learning/BeginnerEditorialImageVisual.tsx',
  'src/components/learning/AcademyEditorialImageVisual.tsx',
];

const TOTAL_BEGINNER_LESSONS = 24;
const TOTAL_ACADEMY_LESSONS = 120;
const TOTAL_ACTIVE_LESSONS = TOTAL_BEGINNER_LESSONS + TOTAL_ACADEMY_LESSONS;

const entries = [];
const issues = [];

for (const registryPath of registries) {
  const absoluteRegistry = path.join(root, registryPath);
  const source = fs.readFileSync(absoluteRegistry, 'utf8');
  const entryPattern = /\{\s*match:\s*'([^']+)'[\s\S]*?role:\s*'([^']+)'[\s\S]*?source:\s*require\('([^']+)'\)[\s\S]*?\}/g;
  let match;
  while ((match = entryPattern.exec(source)) !== null) {
    const [, lessonMatch, role, requiredPath] = match;
    const resolvedAsset = path.resolve(path.dirname(absoluteRegistry), requiredPath);
    const relativeAsset = path.relative(root, resolvedAsset).replaceAll('\\', '/');
    entries.push({ registryPath, lessonMatch, role, asset: relativeAsset });
    if (!fs.existsSync(resolvedAsset)) {
      issues.push(`Missing real image asset: ${lessonMatch} · ${role} -> ${relativeAsset}`);
    }
  }
}

const seen = new Set();
for (const entry of entries) {
  const key = `${entry.lessonMatch}::${entry.role}`;
  if (seen.has(key)) issues.push(`Duplicate editorial mapping: ${entry.lessonMatch} · ${entry.role}`);
  seen.add(key);
}

const beginnerEntries = entries.filter((entry) => entry.registryPath.includes('BeginnerEditorial'));
const academyEntries = entries.filter((entry) => entry.registryPath.includes('AcademyEditorial'));
const beginnerLessons = new Set(beginnerEntries.map((entry) => entry.lessonMatch));
const academyLessons = new Set(academyEntries.map((entry) => entry.lessonMatch));
const uniqueLessons = new Set(entries.map((entry) => entry.lessonMatch));

const percentage = (count, total) => `${((count / total) * 100).toFixed(1)}%`;

console.log(`Real editorial image mappings: ${entries.length}`);
console.log(`- Beginner mappings: ${beginnerEntries.length}`);
console.log(`- Academy mappings: ${academyEntries.length}`);
console.log(`- Beginner lessons with real image: ${beginnerLessons.size}/${TOTAL_BEGINNER_LESSONS} (${percentage(beginnerLessons.size, TOTAL_BEGINNER_LESSONS)})`);
console.log(`- Academy lessons with real image: ${academyLessons.size}/${TOTAL_ACADEMY_LESSONS} (${percentage(academyLessons.size, TOTAL_ACADEMY_LESSONS)})`);
console.log(`- Active lessons with at least one real image: ${uniqueLessons.size}/${TOTAL_ACTIVE_LESSONS} (${percentage(uniqueLessons.size, TOTAL_ACTIVE_LESSONS)})`);
console.log(`- Remaining lessons still relying only on generated/code fallback: ${TOTAL_ACTIVE_LESSONS - uniqueLessons.size}`);

if (issues.length > 0) {
  console.error('\nEditorial image asset audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Editorial image asset audit: PASS');
