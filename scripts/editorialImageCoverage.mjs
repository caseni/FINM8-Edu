import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registries = [
  'src/components/learning/BeginnerEditorialImageVisual.tsx',
  'src/components/learning/AcademyEditorialImageVisual.tsx',
];

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

const beginner = entries.filter((entry) => entry.registryPath.includes('BeginnerEditorial')).length;
const academy = entries.filter((entry) => entry.registryPath.includes('AcademyEditorial')).length;
const uniqueLessons = new Set(entries.map((entry) => entry.lessonMatch)).size;

console.log(`Real editorial image mappings: ${entries.length}`);
console.log(`- Beginner mappings: ${beginner}`);
console.log(`- Academy mappings: ${academy}`);
console.log(`- Lessons with at least one real image: ${uniqueLessons}`);

if (issues.length > 0) {
  console.error('\nEditorial image asset audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Editorial image asset audit: PASS');
