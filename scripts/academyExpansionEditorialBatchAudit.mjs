import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const planPath = path.join(root, 'docs/ACADEMY_EXPANSION_EDITORIAL_IMAGE_BATCHES.json');
const registryPath = path.join(root, 'src/components/learning/AcademyEditorialImageVisual.tsx');
const academyDir = path.join(root, 'src/domain/learning/examples/academy');
const extensions = ['webp', 'png', 'jpg', 'jpeg'];
const validStatuses = new Set(['planned', 'integrated']);
const validBatchStatuses = new Set(['planned', 'active', 'integrated']);
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
for (const file of filesRecursively(academyDir, (file) => /ExpansionLessons\.ts$/.test(file))) {
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
  registryEntries.set(`${slug}::${role}`, relative);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
if (!Array.isArray(plan.batches)) issues.push('Academy expansion editorial plan must contain a batches array');
if (plan.scope !== 'academy-expansion-hook-first') issues.push(`Unexpected Academy expansion scope: ${plan.scope}`);

const keys = new Set();
const batchIds = new Set();
const schools = new Set();
let plannedCount = 0;
let integratedCount = 0;
let physicalCount = 0;
let mappedCount = 0;

for (const batch of plan.batches ?? []) {
  if (!batch?.id || !Array.isArray(batch.lessons)) {
    issues.push('Academy expansion batch is missing id or lessons array');
    continue;
  }
  if (batchIds.has(batch.id)) issues.push(`Duplicate Academy expansion batch id: ${batch.id}`);
  batchIds.add(batch.id);
  if (!batch.school) issues.push(`Academy expansion batch missing school: ${batch.id}`);
  else schools.add(batch.school);
  if (!validBatchStatuses.has(batch.status)) issues.push(`Invalid Academy expansion batch status for ${batch.id}: ${batch.status}`);

  for (const lesson of batch.lessons) {
    const { slug, role, assetDir, assetPrefix, status } = lesson ?? {};
    const key = `${slug}::${role}`;
    if (!slug || !catalogSlugs.has(slug)) issues.push(`Academy expansion plan references unknown expansion slug: ${slug ?? '<missing>'}`);
    if (role !== 'hook') issues.push(`Academy expansion rollout is hook-first; found ${key}`);
    if (!validStatuses.has(status)) issues.push(`Invalid Academy expansion item status for ${key}: ${status}`);
    if (!assetDir || !assetPrefix) issues.push(`Academy expansion item missing assetDir/assetPrefix: ${key}`);
    if (keys.has(key)) issues.push(`Duplicate Academy expansion lesson/role: ${key}`);
    keys.add(key);
    plannedCount += 1;
    if (status === 'integrated') integratedCount += 1;

    const candidates = extensions.map((ext) => `${assetDir}/${assetPrefix}-${role}.${ext}`);
    const existing = candidates.filter((relative) => fs.existsSync(path.join(root, relative)));
    if (existing.length > 1) issues.push(`Multiple Academy expansion physical assets for ${key}: ${existing.join(', ')}`);
    const physical = existing[0];
    const mapped = registryEntries.get(key);
    if (physical) physicalCount += 1;
    if (physical && mapped === physical) mappedCount += 1;

    if (status === 'integrated' && !physical) issues.push(`Integrated Academy expansion item has no physical asset: ${key}`);
    if (status === 'integrated' && !mapped) issues.push(`Integrated Academy expansion item has no registry mapping: ${key}`);
    if (physical && !mapped) issues.push(`Physical Academy expansion asset is not mapped to its slide: ${key} -> ${physical}`);
    if (mapped && physical && mapped !== physical) issues.push(`Academy expansion mapping points to wrong asset: ${key} -> ${mapped}; expected ${physical}`);
  }
}

console.log('FINM8 EDU Academy expansion editorial audit');
console.log(`canonical Academy expansion slugs: ${catalogSlugs.size}`);
console.log(`expansion schools currently planned: ${schools.size}/10`);
console.log(`expansion hook items currently planned: ${plannedCount}/60`);
console.log(`expansion items marked integrated: ${integratedCount}`);
console.log(`planned physical expansion assets present: ${physicalCount}/${plannedCount}`);
console.log(`planned expansion assets correctly mapped: ${mappedCount}/${plannedCount}`);
console.log(`remaining items in current expansion plan: ${plannedCount - mappedCount}`);

if (issues.length > 0) {
  console.error('\nAcademy expansion editorial audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Academy expansion editorial audit: PASS');
