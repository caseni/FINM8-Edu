import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const academyDir = path.join(root, 'src/domain/learning/examples/academy');
const visualDir = path.join(root, 'src/components/learning');
const expectedAcademyLessonCount = 120; // 24 beginner lessons live outside Academy; total product catalog = 144.

function filesRecursively(dir, predicate) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...filesRecursively(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

const lessonFiles = filesRecursively(
  academyDir,
  (file) => /Lessons\.ts$/.test(file) && !/Sources\.ts$/.test(file),
);
const visualFiles = filesRecursively(
  visualDir,
  (file) => /\.tsx$/.test(file) && !file.endsWith('LearningVisual.tsx'),
);

const lessons = [];
for (const file of lessonFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const regex = /\bslug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(source))) {
    lessons.push({ slug: match[1], file: path.relative(root, file) });
  }
}

const visualSources = visualFiles.map((file) => ({
  file: path.relative(root, file),
  source: fs.readFileSync(file, 'utf8'),
}));

const routed = [];
const unmatched = [];
for (const lesson of lessons) {
  const matches = visualSources
    .filter(({ source }) => source.includes(lesson.slug))
    .map(({ file }) => file);
  if (matches.length > 0) routed.push({ ...lesson, matches });
  else unmatched.push(lesson);
}

const duplicateSlugs = Array.from(
  lessons.reduce((map, lesson) => {
    map.set(lesson.slug, (map.get(lesson.slug) ?? 0) + 1);
    return map;
  }, new Map()),
).filter(([, count]) => count > 1);

console.log('FINM8 EDU Academy visual routing audit');
console.log(`academy lesson slugs: ${lessons.length}`);
console.log(`topic-routed lesson slugs: ${routed.length}/${lessons.length}`);
console.log(`generic visual fallback candidates: ${unmatched.length}`);
console.log(`duplicate academy slugs: ${duplicateSlugs.length}`);
console.log(`product catalog composition: 24 beginner + ${lessons.length} Academy = ${24 + lessons.length}`);

if (unmatched.length > 0) {
  console.log('Unmatched Academy lesson slugs:');
  for (const item of unmatched) console.log(`- ${item.slug} (${item.file})`);
}

if (duplicateSlugs.length > 0) {
  console.log('Duplicate Academy lesson slugs:');
  for (const [slug, count] of duplicateSlugs) console.log(`- ${slug}: ${count}`);
}

if (lessons.length !== expectedAcademyLessonCount) {
  throw new Error(`Academy lesson catalog drifted: expected ${expectedAcademyLessonCount} slugs, found ${lessons.length}`);
}
if (duplicateSlugs.length > 0) {
  throw new Error(`Academy visual routing audit found ${duplicateSlugs.length} duplicate slug(s)`);
}
if (unmatched.length > 0) {
  throw new Error(`Academy visual routing audit found ${unmatched.length} generic-fallback candidate(s)`);
}

console.log('academy visual routing blockers: 0');
