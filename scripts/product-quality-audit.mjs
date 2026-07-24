import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const checks = [
  {
    category: 'Documentation',
    weight: 12,
    files: [
      'docs/product-dna.md',
      'docs/mikyasos-constitution.md',
      'docs/design-language.md',
      'docs/ux-information-architecture.md',
      'docs/dashboard-mission-control.md',
      'docs/motion-language.md',
      'docs/enterprise-components.md',
      'docs/ai-experience.md',
      'docs/enterprise-architecture.md',
      'docs/reliability-quality-performance.md',
      'docs/product-excellence.md',
      'docs/connected-business-ecosystem.md',
      'docs/automation-intelligence.md',
      'docs/business-intelligence-decision-platform.md',
      'docs/integration-api-ecosystem.md',
      'docs/security-privacy-trust.md',
      'docs/scalability-infrastructure-devops.md',
    ],
  },
  {
    category: 'Verification',
    weight: 14,
    files: ['scripts/verify-bounded.mjs', 'scripts/live-smoke-e2e.mjs'],
  },
  {
    category: 'Constitution',
    weight: 10,
    files: ['docs/mikyasos-constitution.md', 'docs/product-dna.md'],
  },
  {
    category: 'Design System',
    weight: 12,
    files: [
      'apps/web/src/components/ui/button.tsx',
      'apps/web/src/components/ui/enterprise-card.tsx',
      'apps/web/src/components/ui/status-badge.tsx',
      'apps/web/src/components/ui/empty-state.tsx',
      'apps/web/src/components/ui/skeleton.tsx',
      'apps/web/src/styles/globals.css',
    ],
  },
  {
    category: 'AI Experience',
    weight: 10,
    files: [
      'apps/web/src/features/ai/pages/ai-pages.tsx',
      'apps/web/src/features/ai/components/ai-experience.tsx',
      'apps/web/src/features/ai/hooks/use-ai-os.ts',
    ],
  },
  {
    category: 'Enterprise Readiness',
    weight: 10,
    files: [
      'apps/web/src/features/admin/pages/admin-pages.tsx',
      'apps/web/src/features/admin/hooks/use-admin.ts',
      'docs/enterprise-architecture.md',
    ],
  },
  {
    category: 'Search And Navigation',
    weight: 8,
    files: [
      'apps/web/src/features/workspace/components/search-modal.tsx',
      'apps/web/src/features/workspace/components/command-palette.tsx',
      'apps/web/src/features/workspace/config/navigation.ts',
    ],
  },
  {
    category: 'Notifications',
    weight: 8,
    files: [
      'apps/web/src/features/notifications/notifications-page.tsx',
      'apps/web/src/features/notifications/use-notification-centre.ts',
      'apps/web/src/features/workspace/components/notification-centre.tsx',
    ],
  },
  {
    category: 'Dashboard',
    weight: 8,
    files: [
      'apps/web/src/features/app/app-home-page.tsx',
      'apps/web/src/features/today/today-command-centre-page.tsx',
      'docs/dashboard-mission-control.md',
    ],
  },
  {
    category: 'Connected Ecosystem',
    weight: 10,
    files: [
      'docs/connected-business-ecosystem.md',
      'apps/web/src/features/app/app-home-page.tsx',
      'apps/web/src/features/workspace/components/search-modal.tsx',
    ],
  },
  {
    category: 'Automation Intelligence',
    weight: 10,
    files: [
      'docs/automation-intelligence.md',
      'apps/web/src/features/automation/pages/automation-pages.tsx',
      'apps/web/src/features/automation/hooks/use-automation.ts',
    ],
  },
  {
    category: 'Business Intelligence',
    weight: 10,
    files: [
      'docs/business-intelligence-decision-platform.md',
      'apps/web/src/features/analytics/pages/analytics-pages.tsx',
      'apps/web/src/features/analytics/hooks/use-analytics.ts',
    ],
  },
  {
    category: 'Integration Ecosystem',
    weight: 10,
    files: [
      'docs/integration-api-ecosystem.md',
      'apps/web/src/features/integrations/pages/integrations-pages.tsx',
      'apps/web/src/features/integrations/hooks/use-integrations.ts',
    ],
  },
  {
    category: 'Security Privacy Trust',
    weight: 10,
    files: [
      'docs/security-privacy-trust.md',
      'apps/web/src/features/admin/pages/admin-pages.tsx',
      'apps/web/src/features/admin/hooks/use-admin.ts',
    ],
  },
  {
    category: 'Scalability DevOps',
    weight: 10,
    files: [
      'docs/scalability-infrastructure-devops.md',
      'docs/reliability-quality-performance.md',
      'apps/web/src/features/admin/pages/admin-pages.tsx',
    ],
  },
  {
    category: 'Production Config',
    weight: 10,
    files: [
      '.github/workflows/ci.yml',
      'docker-compose.yml',
      'package.json',
      'apps/web/package.json',
    ],
  },
  {
    category: 'Release Notes',
    weight: 8,
    files: ['docs/release-notes-v1.0.0.md', 'docs/production-launch.md'],
  },
];

const concerningTerms = [
  'placeholder',
  'coming soon',
  'prepared for',
  'part 2',
  'todo',
  'fixme',
  'not implemented',
];

function run(command, args, timeoutMs = 20_000) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd: process.cwd(), stdio: 'ignore' });
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({ status: 'timeout' });
    }, timeoutMs);
    timer.unref();

    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ status: code === 0 ? 'passed' : 'failed' });
    });
  });
}

async function fileScore(file) {
  if (!existsSync(file)) {
    return { file, score: 0, issue: 'missing' };
  }

  const content = await readFile(file, 'utf8');
  const lower = content
    .split('\n')
    .filter((line) => !line.includes('placeholder=') && !line.includes('placeholder:'))
    .join('\n')
    .toLowerCase();
  const termHits = concerningTerms.filter((term) => lower.includes(term));
  const score = Math.max(0, 100 - termHits.length * 8);
  return { file, score, issue: termHits.length ? `terms: ${termHits.join(', ')}` : 'ok' };
}

const categoryResults = [];

for (const check of checks) {
  const fileResults = await Promise.all(check.files.map(fileScore));
  const score =
    fileResults.reduce((sum, result) => sum + result.score, 0) / Math.max(fileResults.length, 1);
  categoryResults.push({
    category: check.category,
    score: Math.round(score),
    weight: check.weight,
    issues: fileResults.filter((result) => result.issue !== 'ok'),
  });
}

const verification = await run('npm', ['run', 'verify:bounded'], 240_000);
const verificationScore =
  verification.status === 'passed' ? 100 : verification.status === 'timeout' ? 50 : 0;

categoryResults.push({
  category: 'Bounded Verification',
  score: verificationScore,
  weight: 20,
  issues:
    verification.status === 'passed'
      ? []
      : [{ file: 'npm run verify:bounded', issue: verification.status }],
});

const totalWeight = categoryResults.reduce((sum, result) => sum + result.weight, 0);
const weightedScore = Math.round(
  categoryResults.reduce((sum, result) => sum + result.score * result.weight, 0) / totalWeight,
);

console.log('\nProduct quality audit');
console.table(
  categoryResults.map((result) => ({
    category: result.category,
    score: result.score,
    issues: result.issues.length,
  })),
);
console.log(`Overall product quality score: ${weightedScore}/100`);

const weak = categoryResults.filter((result) => result.score < 95);
if (weak.length) {
  console.log('\nCategories below 95:');
  for (const result of weak) {
    console.log(`- ${result.category}: ${result.score}/100`);
    for (const issue of result.issues.slice(0, 5)) {
      console.log(`  - ${issue.file}: ${issue.issue}`);
    }
  }
}

if (weightedScore < 95 || weak.length) {
  process.exitCode = 1;
}
