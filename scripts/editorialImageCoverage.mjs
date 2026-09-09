import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registries = [
  'src/components/learning/BeginnerEditorialImageVisual.tsx',
  'src/components/learning/AcademyEditorialImageVisual.tsx',
];
const beginnerPlanPath = path.join(root, 'docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json');
const academyBatchPlanPath = path.join(root, 'docs/ACADEMY_EDITORIAL_IMAGE_BATCHES.json');
const academyLessonDir = path.join(root, 'src/domain/learning/examples/academy');
const academyAssetDir = path.join(root, 'assets/learning/academy');

const TOTAL_BEGINNER_LESSONS = 26;
const TOTAL_ACADEMY_LESSONS = 120;
const TOTAL_ACTIVE_LESSONS = TOTAL_BEGINNER_LESSONS + TOTAL_ACADEMY_LESSONS;
const VALID_ROLES = new Set(['hook', 'concept', 'practice', 'misconception', 'risk', 'summary']);
const VALID_STATUSES = new Set(['planned', 'integrated']);
const IMAGE_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

const entries = [];
const issues = [];

function filesRecursively(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...filesRecursively(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

function physicalCandidates(assetDir, assetPrefix, role) {
  return IMAGE_EXTENSIONS
    .map((extension) => `${assetDir}/${assetPrefix}-${role}.${extension}`)
    .filter((asset) => fs.existsSync(path.join(root, asset)));
}

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
const entryByKey = new Map();
const beginnerEntryByKey = new Map();
const academyEntryByKey = new Map();
for (const entry of entries) {
  const key = `${entry.lessonMatch}::${entry.role}`;
  if (seen.has(key)) issues.push(`Duplicate editorial mapping: ${entry.lessonMatch} · ${entry.role}`);
  seen.add(key);
  entryByKey.set(key, entry);
  // Beginner and Academy lessons can share the same slug (e.g. Wave1 foundation
  // lessons feed both the Beginner journey and an Academy track), so registry
  // lookups must stay scoped per source file rather than a single shared map.
  if (entry.registryPath.includes('BeginnerEditorial')) beginnerEntryByKey.set(key, entry);
  if (entry.registryPath.includes('AcademyEditorial')) academyEntryByKey.set(key, entry);
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
let physicalPlannedAssetCount = 0;

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
  if (!lesson.assetDir || typeof lesson.assetDir !== 'string') {
    issues.push(`Missing assetDir in beginner editorial rollout plan: ${lesson.slug}`);
  }
  if (!lesson.assetPrefix || typeof lesson.assetPrefix !== 'string') {
    issues.push(`Missing assetPrefix in beginner editorial rollout plan: ${lesson.slug}`);
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

    const existingCandidateAssets = physicalCandidates(lesson.assetDir, lesson.assetPrefix, role);
    const registeredEntry = beginnerEntryByKey.get(key);

    if (existingCandidateAssets.length > 1) {
      issues.push(`Multiple physical assets exist for one beginner role: ${lesson.slug} · ${role} -> ${existingCandidateAssets.join(', ')}`);
    }

    const physicalAsset = existingCandidateAssets[0];
    if (physicalAsset) physicalPlannedAssetCount += 1;

    if (physicalAsset && !registeredEntry) {
      issues.push(`Physical beginner asset is not registered to its slide: ${lesson.slug} · ${role} -> ${physicalAsset}`);
    }

    if (registeredEntry) {
      completedPlannedRoleCount += 1;
      if (!physicalAsset) {
        issues.push(`Registered beginner mapping does not use the planned physical filename: ${lesson.slug} · ${role} -> ${registeredEntry.asset}`);
      } else if (registeredEntry.asset !== physicalAsset) {
        issues.push(`Registered beginner mapping points to the wrong planned asset: ${lesson.slug} · ${role} -> ${registeredEntry.asset}; expected ${physicalAsset}`);
      }
    }

    if (lesson.status === 'integrated' && !registeredEntry) {
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

const academyLessonFiles = filesRecursively(
  academyLessonDir,
  (file) => /Lessons\.ts$/.test(file) && !/Sources\.ts$/.test(file),
);
const academyCatalogSlugs = new Set();
for (const file of academyLessonFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const slugPattern = /\bslug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = slugPattern.exec(source)) !== null) {
    const slug = match[1];
    if (academyCatalogSlugs.has(slug)) issues.push(`Duplicate Academy lesson slug in catalog: ${slug}`);
    academyCatalogSlugs.add(slug);
  }
}
if (academyCatalogSlugs.size !== TOTAL_ACADEMY_LESSONS) {
  issues.push(`Academy editorial audit expected ${TOTAL_ACADEMY_LESSONS} catalog slugs; found ${academyCatalogSlugs.size}`);
}

const academyEntries = entries.filter((entry) => entry.registryPath.includes('AcademyEditorial'));
for (const entry of academyEntries) {
  if (!academyCatalogSlugs.has(entry.lessonMatch)) {
    issues.push(`Academy real-image mapping does not match a canonical lesson slug: ${entry.lessonMatch} · ${entry.role}`);
  }
}

const academyBatchPlan = JSON.parse(fs.readFileSync(academyBatchPlanPath, 'utf8'));
if (!Array.isArray(academyBatchPlan.batches)) {
  issues.push('Academy editorial batch plan must contain a batches array');
}

const academyPlannedKeys = new Set();
let academyPlannedCount = 0;
let academyPlannedIntegratedCount = 0;
let academyPlannedPhysicalCount = 0;
for (const batch of academyBatchPlan.batches ?? []) {
  if (!batch?.id || typeof batch.id !== 'string') issues.push('Academy editorial batch is missing a valid id');
  if (!Array.isArray(batch.lessons)) {
    issues.push(`Academy editorial batch ${batch.id ?? '<unknown>'} must contain a lessons array`);
    continue;
  }

  for (const lesson of batch.lessons) {
    const { slug, role, assetDir, assetPrefix, status } = lesson ?? {};
    if (!slug || typeof slug !== 'string') {
      issues.push(`Academy batch ${batch.id} contains a lesson without a valid slug`);
      continue;
    }
    if (!academyCatalogSlugs.has(slug)) issues.push(`Academy batch lesson is not in canonical catalog: ${slug}`);
    if (!VALID_ROLES.has(role)) issues.push(`Invalid Academy editorial role for ${slug}: ${role}`);
    if (!VALID_STATUSES.has(status)) issues.push(`Invalid Academy rollout status for ${slug}: ${status}`);
    if (!assetDir || typeof assetDir !== 'string') issues.push(`Missing Academy assetDir for ${slug}`);
    if (!assetPrefix || typeof assetPrefix !== 'string') issues.push(`Missing Academy assetPrefix for ${slug}`);

    const key = `${slug}::${role}`;
    if (academyPlannedKeys.has(key)) issues.push(`Duplicate Academy lesson/role in batch plan: ${slug} · ${role}`);
    academyPlannedKeys.add(key);
    academyPlannedCount += 1;

    const existingCandidateAssets = physicalCandidates(assetDir, assetPrefix, role);
    if (existingCandidateAssets.length > 1) {
      issues.push(`Multiple physical assets exist for one Academy planned role: ${slug} · ${role} -> ${existingCandidateAssets.join(', ')}`);
    }
    const physicalAsset = existingCandidateAssets[0];
    const registeredEntry = academyEntryByKey.get(key);
    if (physicalAsset) academyPlannedPhysicalCount += 1;

    if (physicalAsset && !registeredEntry) {
      issues.push(`Physical Academy planned asset is not registered to its slide: ${slug} · ${role} -> ${physicalAsset}`);
    }
    if (registeredEntry) {
      academyPlannedIntegratedCount += 1;
      if (!physicalAsset) {
        issues.push(`Academy registry mapping does not use the planned physical filename: ${slug} · ${role} -> ${registeredEntry.asset}`);
      } else if (registeredEntry.asset !== physicalAsset) {
        issues.push(`Academy registry mapping points to the wrong planned asset: ${slug} · ${role} -> ${registeredEntry.asset}; expected ${physicalAsset}`);
      }
    }
    if (status === 'integrated' && !registeredEntry) {
      issues.push(`Academy lesson marked integrated is missing its planned mapping: ${slug} · ${role}`);
    }
  }
}

const unplannedAcademyMappings = academyEntries.filter(
  (entry) => !academyPlannedKeys.has(`${entry.lessonMatch}::${entry.role}`),
);
for (const entry of unplannedAcademyMappings) {
  issues.push(`Academy real-image mapping is not declared in a rollout batch: ${entry.lessonMatch} · ${entry.role}`);
}

const academyPhysicalAssets = filesRecursively(
  academyAssetDir,
  (file) => IMAGE_EXTENSIONS.includes(path.extname(file).slice(1).toLowerCase()),
).map((file) => path.relative(root, file).replaceAll('\\', '/'));
const academyRegisteredAssets = new Set(academyEntries.map((entry) => entry.asset));
for (const asset of academyPhysicalAssets) {
  if (!academyRegisteredAssets.has(asset)) {
    issues.push(`Physical Academy asset is not registered to a slide role: ${asset}`);
  }
}
for (const asset of academyRegisteredAssets) {
  if (!academyPhysicalAssets.includes(asset)) {
    issues.push(`Academy registry points outside the Academy physical asset inventory: ${asset}`);
  }
}

const beginnerEntries = entries.filter((entry) => entry.registryPath.includes('BeginnerEditorial'));
const beginnerLessons = new Set(beginnerEntries.map((entry) => entry.lessonMatch));
const academyLessons = new Set(academyEntries.map((entry) => entry.lessonMatch));
const uniqueLessons = new Set(entries.map((entry) => entry.lessonMatch));

const percentage = (count, total) => `${((count / total) * 100).toFixed(1)}%`;

console.log(`Real editorial image mappings: ${entries.length}`);
console.log(`- Beginner mappings: ${beginnerEntries.length}`);
console.log(`- Academy mappings: ${academyEntries.length}`);
console.log(`- Beginner lessons with real image: ${beginnerLessons.size}/${TOTAL_BEGINNER_LESSONS} (${percentage(beginnerLessons.size, TOTAL_BEGINNER_LESSONS)})`);
console.log(`- Academy lessons with real image: ${academyLessons.size}/${TOTAL_ACADEMY_LESSONS} (${percentage(academyLessons.size, TOTAL_ACADEMY_LESSONS)})`);
console.log(`- Academy physical editorial assets: ${academyPhysicalAssets.length}`);
console.log(`- Academy physical assets registered to slides: ${academyRegisteredAssets.size}/${academyPhysicalAssets.length}`);
console.log(`- Academy active batch roles integrated: ${academyPlannedIntegratedCount}/${academyPlannedCount}`);
console.log(`- Academy active batch physical assets present: ${academyPlannedPhysicalCount}/${academyPlannedCount}`);
console.log(`- Active lessons with at least one real image: ${uniqueLessons.size}/${TOTAL_ACTIVE_LESSONS} (${percentage(uniqueLessons.size, TOTAL_ACTIVE_LESSONS)})`);
console.log(`- Remaining lessons still relying only on generated/code fallback: ${TOTAL_ACTIVE_LESSONS - uniqueLessons.size}`);
console.log(`- Beginner rollout plan coverage: ${planSlugs.size}/${TOTAL_BEGINNER_LESSONS} lessons declared`);
console.log(`- Beginner rollout plan: ${completedPlannedRoleCount}/${plannedRoleCount} planned real-image roles physically integrated`);
console.log(`- Physical beginner assets matching planned filenames: ${physicalPlannedAssetCount}/${plannedRoleCount}`);
console.log(`- Beginner lessons marked integrated in rollout plan: ${integratedLessonCount}/${planSlugs.size}`);

for (const lesson of beginnerPlan.lessons ?? []) {
  const missingRoles = lesson.roles.filter((role) => !seen.has(`${lesson.slug}::${role}`));
  if (missingRoles.length > 0) {
    console.log(`  · ${lesson.slug}: waiting for ${missingRoles.join(', ')}`);
  } else {
    console.log(`  · ${lesson.slug}: real-image roles complete`);
  }
}

if (academyLessons.size > 0) {
  console.log('- Academy lessons with real editorial images:');
  for (const slug of [...academyLessons].sort()) console.log(`  · ${slug}`);
}

if (issues.length > 0) {
  console.error('\nEditorial image asset audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Editorial image asset audit: PASS');
