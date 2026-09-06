import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const beginnerPlan = JSON.parse(fs.readFileSync(path.join(root, 'docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json'), 'utf8'));
const academyFoundationPlan = JSON.parse(fs.readFileSync(path.join(root, 'docs/ACADEMY_EDITORIAL_IMAGE_BATCHES.json'), 'utf8'));
const academyExpansionPlan = JSON.parse(fs.readFileSync(path.join(root, 'docs/ACADEMY_EXPANSION_EDITORIAL_IMAGE_BATCHES.json'), 'utf8'));

const registryFiles = [
  ['beginner', 'src/components/learning/BeginnerEditorialImageVisual.tsx'],
  ['academy', 'src/components/learning/AcademyEditorialImageVisual.tsx'],
];

const issues = [];
const mappings = [];
const mappingKeys = new Set();

for (const [scope, relativeRegistry] of registryFiles) {
  const registryPath = path.join(root, relativeRegistry);
  const source = fs.readFileSync(registryPath, 'utf8');
  const regex = /\{\s*match:\s*'([^']+)'[\s\S]*?role:\s*'([^']+)'[\s\S]*?source:\s*require\('([^']+)'\)[\s\S]*?\}/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const [, slug, role, requiredPath] = match;
    const absoluteAsset = path.resolve(path.dirname(registryPath), requiredPath);
    const asset = path.relative(root, absoluteAsset).replaceAll('\\', '/');
    const key = `${slug}::${role}`;
    if (mappingKeys.has(key)) issues.push(`Duplicate real-image mapping across registries: ${key}`);
    mappingKeys.add(key);
    mappings.push({ scope, slug, role, asset, exists: fs.existsSync(absoluteAsset) });
    if (!fs.existsSync(absoluteAsset)) issues.push(`Mapped real-image asset is missing: ${key} -> ${asset}`);
  }
}

const beginnerLessons = beginnerPlan.lessons ?? [];
const beginnerPlannedRoles = beginnerLessons.reduce((sum, lesson) => sum + (lesson.roles?.length ?? 0), 0);
const beginnerIntegratedRoleKeys = new Set(
  mappings.filter((entry) => entry.scope === 'beginner' && entry.exists).map((entry) => `${entry.slug}::${entry.role}`),
);
const beginnerLessonsWithImage = new Set(
  mappings.filter((entry) => entry.scope === 'beginner' && entry.exists).map((entry) => entry.slug),
);

const foundationItems = (academyFoundationPlan.batches ?? []).flatMap((batch) => batch.lessons ?? []);
const expansionItems = (academyExpansionPlan.batches ?? []).flatMap((batch) => batch.lessons ?? []);
const academyMappings = mappings.filter((entry) => entry.scope === 'academy' && entry.exists);
const foundationKeys = new Set(foundationItems.map((item) => `${item.slug}::${item.role}`));
const expansionKeys = new Set(expansionItems.map((item) => `${item.slug}::${item.role}`));
const academyFoundationIntegrated = academyMappings.filter((entry) => foundationKeys.has(`${entry.slug}::${entry.role}`));
const academyExpansionIntegrated = academyMappings.filter((entry) => expansionKeys.has(`${entry.slug}::${entry.role}`));
const academyLessonsWithImage = new Set(academyMappings.map((entry) => entry.slug));

if (beginnerLessons.length !== 24) issues.push(`Beginner rollout must contain 24 lessons; found ${beginnerLessons.length}`);
if (beginnerPlannedRoles !== 115) issues.push(`Beginner rollout must contain 115 planned real-image roles; found ${beginnerPlannedRoles}`);
if (foundationItems.length !== 60) issues.push(`Academy foundation rollout must contain 60 hook items; found ${foundationItems.length}`);
if (expansionItems.length !== 60) issues.push(`Academy expansion rollout must contain 60 hook items; found ${expansionItems.length}`);

const academyPlanKeys = new Set([...foundationKeys, ...expansionKeys]);
for (const entry of academyMappings) {
  const key = `${entry.slug}::${entry.role}`;
  if (!academyPlanKeys.has(key)) issues.push(`Academy real-image mapping is outside foundation/expansion rollout plans: ${key}`);
}

const totalPhysicalMappings = mappings.filter((entry) => entry.exists).length;
const totalLessonsWithImage = new Set(mappings.filter((entry) => entry.exists).map((entry) => entry.slug)).size;
const TOTAL_LESSONS = 144;

console.log('FINM8 EDU real-image rollout status');
console.log(`Beginner lessons planned: ${beginnerLessons.length}/24`);
console.log(`Beginner planned real-image roles: ${beginnerPlannedRoles}`);
console.log(`Beginner physical roles integrated: ${beginnerIntegratedRoleKeys.size}/${beginnerPlannedRoles}`);
console.log(`Beginner lessons with at least one real asset: ${beginnerLessonsWithImage.size}/24`);
console.log(`Academy foundation hooks planned: ${foundationItems.length}/60`);
console.log(`Academy foundation physical hooks integrated: ${academyFoundationIntegrated.length}/${foundationItems.length}`);
console.log(`Academy expansion hooks planned: ${expansionItems.length}/60`);
console.log(`Academy expansion physical hooks integrated: ${academyExpansionIntegrated.length}/${expansionItems.length}`);
console.log(`Academy lessons with at least one real asset: ${academyLessonsWithImage.size}/120`);
console.log(`Total physical real-image mappings: ${totalPhysicalMappings}`);
console.log(`Active lessons with at least one real asset: ${totalLessonsWithImage}/${TOTAL_LESSONS}`);
console.log(`Active lessons still without a physical real asset: ${TOTAL_LESSONS - totalLessonsWithImage}`);

if (issues.length > 0) {
  console.error('\nReal-image rollout status audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Real-image rollout status audit: PASS');
