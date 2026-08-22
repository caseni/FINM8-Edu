import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const planPath = path.join(root, 'docs/ACADEMY_EDITORIAL_IMAGE_BATCHES.json');
const registryPath = path.join(root, 'src/components/learning/AcademyEditorialImageVisual.tsx');
const academyDir = path.join(root, 'src/domain/learning/examples/academy');
const extensions = ['webp', 'png', 'jpg', 'jpeg'];
const validStatuses = new Set(['planned', 'integrated']);
const validBatchStatuses = new Set(['planned', 'active', 'integrated']);
const validRoles = new Set(['hook', 'concept', 'practice', 'misconception', 'risk', 'summary']);
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

const catalogSlugs = new Set();
for (const file of filesRecursively(academyDir, (file) => /Lessons\.ts$/.test(file) && !/Sources\.ts$/.test(file))) {
  const source = fs.readFileSync(file, 'utf8');
  const regex = /\bslug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(source)) !== null) catalogSlugs.add(match[1]);
}

const registrySource = fs.readFileSync(registryPath, 'utf8');
const registryEntries = new Map();
const registryRegex = /\{\s*match:\s*'([^']+)'[\s\S]*?role:\s*'([^']+)'[\s\S]*?source:\s*require\('([^']+)'\)[\s\S]*?\}/g;
let registryMatch;
while ((registryMatch = registryRegex.exec(registrySource)) !== null) {
  const [, slug, role, requiredPath] = registryMatch;
  const absolute = path.resolve(path.dirname(registryPath), requiredPath);
  const relative = path.relative(root, absolute).replaceAll('\\', '/');
  const key = `${slug}::${role}`;
  if (registryEntries.has(key)) issues.push(`Duplicate Academy registry mapping: ${key}`);
  registryEntries.set(key, relative);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
if (!Array.isArray(plan.batches)) issues.push('Academy editorial batch plan must contain a batches array');

const plannedKeys = new Set();
const batchIds = new Set();
const batchProgress = [];
let plannedCount = 0;
let integratedCount = 0;
let physicallyPresentCount = 0;
let correctlyMappedCount = 0;

for (const batch of plan.batches ?? []) {
  if (!batch?.id || !Array.isArray(batch.lessons)) {
    issues.push('Academy editorial batch is missing id or lessons array');
    continue;
  }
  if (batchIds.has(batch.id)) issues.push(`Duplicate Academy editorial batch id: ${batch.id}`);
  batchIds.add(batch.id);
  if (!validBatchStatuses.has(batch.status)) issues.push(`Invalid Academy editorial batch status for ${batch.id}: ${batch.status}`);

  let batchIntegrated = 0;
  let batchMapped = 0;

  for (const lesson of batch.lessons) {
    const { slug, role, assetDir, assetPrefix, status } = lesson ?? {};
    if (!slug || !catalogSlugs.has(slug)) issues.push(`Academy batch references unknown lesson slug: ${slug ?? '<missing>'}`);
    if (!validRoles.has(role)) issues.push(`Invalid Academy editorial role for ${slug}: ${role}`);
    if (!validStatuses.has(status)) issues.push(`Invalid Academy editorial status for ${slug}: ${status}`);
    if (!assetDir || !assetPrefix) issues.push(`Academy batch is missing assetDir/assetPrefix for ${slug}`);

    const key = `${slug}::${role}`;
    if (plannedKeys.has(key)) issues.push(`Duplicate Academy batch lesson/role: ${key}`);
    plannedKeys.add(key);
    plannedCount += 1;
    if (status === 'integrated') {
      integratedCount += 1;
      batchIntegrated += 1;
    }

    const candidates = extensions.map((ext) => `${assetDir}/${assetPrefix}-${role}.${ext}`);
    const existing = candidates.filter((relative) => fs.existsSync(path.join(root, relative)));
    if (existing.length > 1) issues.push(`Multiple Academy physical assets for ${key}: ${existing.join(', ')}`);
    const physical = existing[0];
    if (physical) physicallyPresentCount += 1;

    const mapped = registryEntries.get(key);
    if (mapped && physical && mapped === physical) {
      correctlyMappedCount += 1;
      batchMapped += 1;
    }

    if (status === 'integrated' && !physical) issues.push(`Integrated Academy item has no physical asset: ${key}`);
    if (status === 'integrated' && !mapped) issues.push(`Integrated Academy item has no registry mapping: ${key}`);
    if (physical && !mapped) issues.push(`Physical Academy batch asset is not mapped to its slide: ${key} -> ${physical}`);
    if (mapped && !physical) issues.push(`Academy batch registry mapping has no planned physical asset: ${key} -> ${mapped}`);
    if (mapped && physical && mapped !== physical) issues.push(`Academy batch mapping points to wrong asset: ${key} -> ${mapped}; expected ${physical}`);
  }

  if (batch.status === 'integrated' && batchIntegrated !== batch.lessons.length) {
    issues.push(`Academy batch marked integrated but contains non-integrated items: ${batch.id}`);
  }

  batchProgress.push({
    id: batch.id,
    school: batch.school ?? 'unknown',
    total: batch.lessons.length,
    integrated: batchIntegrated,
    mapped: batchMapped,
  });
}

console.log('FINM8 EDU Academy editorial batch audit');
console.log(`academy catalog slugs: ${catalogSlugs.size}`);
console.log(`academy editorial batches: ${batchIds.size}`);
console.log(`planned batch lesson/roles: ${plannedCount}`);
console.log(`items marked integrated: ${integratedCount}`);
console.log(`planned physical assets present: ${physicallyPresentCount}/${plannedCount}`);
console.log(`planned assets correctly mapped to slides: ${correctlyMappedCount}/${plannedCount}`);
console.log(`remaining planned Academy items: ${plannedCount - correctlyMappedCount}`);
console.log('batch progress:');
for (const batch of batchProgress) {
  console.log(`- ${batch.id} [${batch.school}]: mapped ${batch.mapped}/${batch.total}; marked integrated ${batch.integrated}/${batch.total}`);
}

if (issues.length > 0) {
  console.error('\nAcademy editorial batch audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Academy editorial batch audit: PASS');
