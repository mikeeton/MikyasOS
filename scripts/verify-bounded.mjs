import { spawn } from 'node:child_process';

const defaultTimeoutMs = Number(process.env.VERIFY_TIMEOUT_MS ?? 180_000);

const steps = [
  ['format:check', ['npm', ['run', 'format:check']], 120_000],
  ['web:typecheck', ['npm', ['run', 'typecheck', '-w', '@mikyasos/web']], defaultTimeoutMs],
  ['web:lint', ['npm', ['run', 'lint', '-w', '@mikyasos/web']], defaultTimeoutMs],
  ['web:build', ['npm', ['run', 'build', '-w', '@mikyasos/web']], 240_000],
  ['api:prisma:generate', ['npm', ['run', 'prisma:generate', '-w', '@mikyasos/api']], 120_000],
  ['docker:config', ['docker', ['compose', 'config']], 120_000],
];

function runStep(name, [command, args], timeoutMs) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
      shell: false,
    });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      setTimeout(() => child.kill('SIGKILL'), 3_000).unref();
      resolve({
        name,
        status: 'timeout',
        durationMs: Date.now() - startedAt,
        timeoutMs,
      });
    }, timeoutMs);

    timer.unref();

    child.on('exit', (code, signal) => {
      clearTimeout(timer);
      resolve({
        name,
        status: code === 0 ? 'passed' : 'failed',
        code,
        signal,
        durationMs: Date.now() - startedAt,
        timeoutMs,
      });
    });
  });
}

const results = [];

for (const [name, command, timeoutMs] of steps) {
  console.log(`\n[verify] ${name} started (timeout ${Math.round(timeoutMs / 1000)}s)`);
  const result = await runStep(name, command, timeoutMs);
  results.push(result);
  console.log(`[verify] ${name} ${result.status} in ${Math.round(result.durationMs / 1000)}s`);

  if (result.status !== 'passed') {
    break;
  }
}

const failed = results.find((result) => result.status !== 'passed');

console.log('\n[verify] summary');
console.table(
  results.map((result) => ({
    step: result.name,
    status: result.status,
    seconds: Math.round(result.durationMs / 1000),
    timeoutSeconds: Math.round(result.timeoutMs / 1000),
  })),
);

if (failed) {
  process.exitCode = 1;
}
