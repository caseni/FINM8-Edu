import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const academyDir = path.join(root, 'src/domain/learning/examples/academy');
const visualDir = path.join(root, 'src/components/learning');
const expectedAcademyLessonCount = 120; // 24 beginner lessons live outside Academy; total product catalog = 144.
const modernVisualFiles = new Set([
  'AcademyFoundationCleanVisual.tsx',
  'AcademyAdvancedCleanVisual.tsx',
  'AcademyCoreExpansionCleanVisual.tsx',
]);

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
const modernFiles = visualFiles.filter((file) => modernVisualFiles.has(path.basename(file)));

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
const modernSources = modernFiles.map((file) => ({
  file: path.relative(root, file),
  source: fs.readFileSync(file, 'utf8'),
}));

function routeCoverage(sources) {
  const matched = [];
  const unmatched = [];
  for (const lesson of lessons) {
    const matches = sources
      .filter(({ source }) => source.includes(lesson.slug))
      .map(({ file }) => file);
    if (matches.length > 0) matched.push({ ...lesson, matches });
    else unmatched.push(lesson);
  }
  return { matched, unmatched };
}

const routed = routeCoverage(visualSources);
const modern = routeCoverage(modernSources);

const duplicateSlugs = Array.from(
  lessons.reduce((map, lesson) => {
    map.set(lesson.slug, (map.get(lesson.slug) ?? 0) + 1);
    return map;
  }, new Map()),
).filter(([, count]) => count > 1);

// Visual content blocks are rendered by LessonBlockRenderer before they can fall back
// to LessonSupportingVisual. Keep legacy substring routes from accidentally hijacking
// a modern Academy visual (for example `includes('choch')` matching an MSS/CHoCH slug).
const legacyRendererPath = path.join(visualDir, 'LessonBlockRenderer.tsx');
const legacyRendererSource = fs.readFileSync(legacyRendererPath, 'utf8');
const legacyRouteTokens = Array.from(
  legacyRendererSource.matchAll(/block\.assetRef\.includes\(['"]([^'"]+)['"]\)/g),
  (match) => match[1],
);
const legacyRendererCollisions = [];
for (const lesson of lessons) {
  const academyAssetRefs = [
    lesson.slug,
    `edu://wave1/${lesson.slug}`,
    `edu://academy/${lesson.slug}`,
  ];
  for (const token of legacyRouteTokens) {
    if (academyAssetRefs.some((assetRef) => assetRef.includes(token))) {
      legacyRendererCollisions.push({
        slug: lesson.slug,
        token,
        file: lesson.file,
      });
    }
  }
}

console.log('FINM8 EDU Academy visual routing audit');
console.log(`academy lesson slugs: ${lessons.length}`);
console.log(`topic-routed lesson slugs: ${routed.matched.length}/${lessons.length}`);
console.log(`generic visual fallback candidates: ${routed.unmatched.length}`);
console.log(`modern clean visual coverage: ${modern.matched.length}/${lessons.length}`);
console.log(`legacy-only visual candidates: ${modern.unmatched.length}`);
console.log(`duplicate academy slugs: ${duplicateSlugs.length}`);
console.log(`legacy renderer Academy collisions: ${legacyRendererCollisions.length}`);
console.log(`product catalog composition: 24 beginner + ${lessons.length} Academy = ${24 + lessons.length}`);

if (routed.unmatched.length > 0) {
  console.log('Unmatched Academy lesson slugs:');
  for (const item of routed.unmatched) console.log(`- ${item.slug} (${item.file})`);
}

if (modern.unmatched.length > 0) {
  console.log('Academy lessons outside the modern clean visual system:');
  for (const item of modern.unmatched) console.log(`- ${item.slug} (${item.file})`);
}

if (duplicateSlugs.length > 0) {
  console.log('Duplicate Academy lesson slugs:');
  for (const [slug, count] of duplicateSlugs) console.log(`- ${slug}: ${count}`);
}

if (legacyRendererCollisions.length > 0) {
  console.log('Academy lessons intercepted by legacy visual substring routes:');
  for (const item of legacyRendererCollisions) {
    console.log(`- ${item.slug} <- includes('${item.token}') (${item.file})`);
  }
}

if (lessons.length !== expectedAcademyLessonCount) {
  throw new Error(`Academy lesson catalog drifted: expected ${expectedAcademyLessonCount} slugs, found ${lessons.length}`);
}
if (duplicateSlugs.length > 0) {
  throw new Error(`Academy visual routing audit found ${duplicateSlugs.length} duplicate slug(s)`);
}
if (routed.unmatched.length > 0) {
  throw new Error(`Academy visual routing audit found ${routed.unmatched.length} generic-fallback candidate(s)`);
}
if (modern.unmatched.length > 0) {
  throw new Error(`Academy visual routing audit found ${modern.unmatched.length} legacy-only visual candidate(s)`);
}
if (legacyRendererCollisions.length > 0) {
  throw new Error(`Academy visual routing audit found ${legacyRendererCollisions.length} legacy renderer collision(s)`);
}

console.log('academy visual routing blockers: 0');
