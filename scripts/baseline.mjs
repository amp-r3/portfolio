import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, '.worktrees/portfolio-baseline');
const baseline = JSON.parse(readFileSync(resolve(root, 'docs/migration/baseline.json'), 'utf8'));
const mode = process.argv[2];

function run(command, args, cwd = directory) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function verify() {
  if (process.versions.node !== baseline.node) throw new Error(`Baseline requires Node.js ${baseline.node}; run nvm use.`);
  const pnpm = spawnSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' });
  if (pnpm.status !== 0 || pnpm.stdout.trim() !== baseline.pnpm) throw new Error(`Baseline requires pnpm ${baseline.pnpm}.`);
  if (!existsSync(directory)) throw new Error('Run pnpm baseline:prepare first.');
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' });
  const dirty = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: directory, encoding: 'utf8' });
  const lock = createHash('sha256').update(readFileSync(resolve(directory, 'pnpm-lock.yaml'))).digest('hex');
  if (head.status !== 0 || head.stdout.trim() !== baseline.sourceCommit || dirty.status !== 0 || dirty.stdout.trim() || lock !== baseline.lockfileSha256) {
    throw new Error('Baseline checkout or lockfile differs from the recorded source. Refusing to use it.');
  }
}

if (mode === 'prepare') {
  if (!existsSync(directory)) run('git', ['worktree', 'add', '--detach', directory, baseline.sourceCommit], root);
  verify();
  run('pnpm', ['install', '--frozen-lockfile']);
  mkdirSync(resolve(root, 'artifacts/baseline'), { recursive: true });
  for (const check of ['build', 'lint']) {
    const result = spawnSync('pnpm', [check], { cwd: directory, encoding: 'utf8' });
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    process.stdout.write(output);
    writeFileSync(resolve(root, `artifacts/baseline/${check}.log`), output);
    if (result.status !== 0) throw new Error(`Baseline ${check} failed; see artifacts/baseline/${check}.log`);
  }
} else if (mode === 'serve') {
  verify();
  run('pnpm', ['preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort']);
} else if (mode === 'capture' || mode === 'record') {
  verify();
  const child = spawn('pnpm', ['exec', 'playwright', 'test', '--config', 'playwright.visual.config.ts', ...(mode === 'record' ? ['--grep', '@record'] : ['--grep-invert', '@record']), ...process.argv.slice(3)], {
    cwd: root,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
    env: { ...process.env, VISUAL_TARGET: 'baseline', BASELINE_CAPTURE: mode === 'capture' ? '1' : '0', BASELINE_RECORD: mode === 'record' ? '1' : '0' },
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      if (child.pid && child.exitCode === null) {
        if (process.platform === 'win32') child.kill(signal);
        else process.kill(-child.pid, signal);
      }
    });
  }
  child.on('exit', (code) => process.exit(code ?? 1));
  child.on('error', (error) => { console.error(error); process.exitCode = 1; });
} else {
  throw new Error('Expected prepare, serve, capture, or record.');
}
