const fs = require('node:fs');

const severityRank = { critical: 5, high: 4, moderate: 3, low: 2, info: 1, none: 0 };

function readAudit(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`Could not read ${path}: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
    return { vulnerabilities: {}, metadata: { vulnerabilities: {} } };
  }
}

function counts(audit) {
  const values = audit?.metadata?.vulnerabilities ?? {};
  return {
    critical: values.critical ?? 0,
    high: values.high ?? 0,
    moderate: values.moderate ?? 0,
    low: values.low ?? 0,
    info: values.info ?? 0,
    total: values.total ?? 0,
  };
}

function advisoryDetails(vulnerability) {
  const via = Array.isArray(vulnerability.via) ? vulnerability.via : [];
  const advisories = via
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      source: entry.source,
      title: entry.title,
      url: entry.url,
      severity: entry.severity,
      range: entry.range,
    }));
  const inheritedFrom = via.filter((entry) => typeof entry === 'string');
  return { advisories, inheritedFrom };
}

function fixLabel(fixAvailable) {
  if (fixAvailable === true) return 'available';
  if (!fixAvailable) return 'none';
  if (typeof fixAvailable === 'object') {
    return `${fixAvailable.name ?? 'package'}@${fixAvailable.version ?? '?'}${fixAvailable.isSemVerMajor ? ' (major)' : ''}`;
  }
  return String(fixAvailable);
}

function summarize(label, audit) {
  const summary = counts(audit);
  console.log(`\n${label}`);
  console.log(`counts: total=${summary.total} critical=${summary.critical} high=${summary.high} moderate=${summary.moderate} low=${summary.low} info=${summary.info}`);

  const vulnerabilities = Object.values(audit.vulnerabilities ?? {})
    .sort((left, right) => {
      const severityDelta = (severityRank[right.severity] ?? 0) - (severityRank[left.severity] ?? 0);
      if (severityDelta !== 0) return severityDelta;
      if (left.isDirect !== right.isDirect) return left.isDirect ? -1 : 1;
      return String(left.name).localeCompare(String(right.name));
    });

  for (const vulnerability of vulnerabilities) {
    const details = advisoryDetails(vulnerability);
    console.log(`- ${vulnerability.name}: severity=${vulnerability.severity} direct=${Boolean(vulnerability.isDirect)} range=${vulnerability.range ?? '?'} fix=${fixLabel(vulnerability.fixAvailable)}`);
    if (details.inheritedFrom.length > 0) {
      console.log(`  via packages: ${details.inheritedFrom.join(', ')}`);
    }
    for (const advisory of details.advisories) {
      console.log(`  advisory: ${advisory.title ?? advisory.source ?? 'unknown'} | severity=${advisory.severity ?? '?'} | range=${advisory.range ?? '?'}${advisory.url ? ` | ${advisory.url}` : ''}`);
    }
  }
}

const runtime = readAudit(process.argv[2] ?? 'runtime-audit.json');
const full = readAudit(process.argv[3] ?? 'full-audit.json');

console.log('FINM8 EDU dependency advisory audit (read-only)');
summarize('Runtime dependency tree (--omit=dev)', runtime);
summarize('Full dependency tree', full);
