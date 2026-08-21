import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registries = [
  'src/components/learning/BeginnerEditorialImageVisual.tsx',
  'src/components/learning/AcademyEditorialImageVisual.tsx',
];
const beginnerPlanPath = path.join(root, 'docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json');

const TOTAL_BEGINNER_LESSONS = 24;
const TOTAL_ACADEMY_LESSONS = 120;
const TOTAL_ACTIVE_LESSONS = TOTAL_BEGINNER_LESSONS + TOTAL_ACADEMY_LESSONS;
const VALID_ROLES = new Set(['hook', 'concept', 'practice', 'misconception', 'risk', 'summary']);
const VALID_STATUSES = new Set(['planned', 'integrated']);

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

const beginnerPlan = JSON.parse(fs.readFileSync(beginnerPlanPath, 'utf8'));
if (!Array.isArray(beginnerPlan.lessons)) {
  issues.push('Beginner editorial rollout plan must contain a lessons array');
}

const plannedRoleKeys = new Set();
const planSlugs = new Set();
let plannedRoleCount = 0;
let completedPlannedRoleCount = 0;
let integratedLessonCount = 0;

for (const lesson of beginnerPlan.lessons ?? []) {
  if (!lesson?.slug || typeof lesson.slug !== 'string') {
    issues.push('Beginner editorial rollout plan contains a lesson without a valid slug');
    continue;
  }
  if (planSlugs.has(lesson.slug)) issues.push(`Duplicate lesson in beginner editorial rollout plan: ${lesson.slug}`);
  planSlugs.add(lesson.slug);

  if (!VALID_STATUSES.has(lesson.status)) {
    issues.push(`Invalid rollout status for ${lesson.slug}: ${lesson.status}`);
  }

  const roles = Array.isArray(lesson.roles) ? lesson.roles : [];
  const exampleOnlyRoles = Array.isArray(lesson.exampleOnlyRoles) ? lesson.exampleOnlyRoles : [];
  const localRoleSet = new Set();

  for (const role of [...roles, ...exampleOnlyRoles]) {
    if (!VALID_ROLES.has(role)) issues.push(`Invalid editorial role for ${lesson.slug}: ${role}`);
    if (localRoleSet.has(role)) issues.push(`Role is declared twice for ${lesson.slug}: ${role}`);
    localRoleSet.add(role);
  }

  if (lesson.status === 'integrated') integratedLessonCount += 1;

  for (const role of roles) {
    const key = `${lesson.slug}::${role}`;
    plannedRoleKeys.add(key);
    plannedRoleCount += 1;
    if (seen.has(key)) completedPlannedRoleCount += 1;
    if (lesson.status === 'integrated' && !seen.has(key)) {
      issues.push(`Integrated lesson is missing planned real image: ${lesson.slug} · ${role}`);
    }
  }
}

if (planSlugs.size !== TOTAL_BEGINNER_LESSONS) {
  issues.push(`Beginner editorial rollout plan must cover exactly ${TOTAL_BEGINNER_LESSONS} lessons; found ${planSlugs.size}`);
}

const unplannedBeginnerMappings = entries.filter(
  (entry) => entry.registryPath.includes('BeginnerEditorial') && !plannedRoleKeys.has(`${entry.lessonMatch}::${entry.role}`),
);
for (const entry of unplannedBeginnerMappings) {
  issues.push(`Beginner real-image mapping is not declared in rollout plan: ${entry.lessonMatch} · ${entry.role}`);
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
console.log(`- Beginner rollout plan coverage: ${planSlugs.size}/${TOTAL_BEGINNER_LESSONS} lessons declared`);
console.log(`- Beginner rollout plan: ${completedPlannedRoleCount}/${plannedRoleCount} planned real-image roles physically integrated`);
console.log(`- Beginner lessons marked integrated in rollout plan: ${integratedLessonCount}/${planSlugs.size}`);

for (const lesson of beginnerPlan.lessons ?? []) {
  const missingRoles = lesson.roles.filter((role) => !seen.has(`${lesson.slug}::${role}`));
  if (missingRoles.length > 0) {
    console.log(`  · ${lesson.slug}: waiting for ${missingRoles.join(', ')}`);
  } else {
    console.log(`  · ${lesson.slug}: real-image roles complete`);
  }
}

if (issues.length > 0) {
  console.error('\nEditorial image asset audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Editorial image asset audit: PASS');
