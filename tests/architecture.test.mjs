import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { ESLint } from 'eslint';
import { createArchitectureConfig } from '../scripts/fsd-config.mjs';

const root = await mkdtemp(resolve(tmpdir(), 'portfolio-fsd-'));
after(() => rm(root, { recursive: true, force: true }));

const files = [
  'app/page.ts', 'src/_app/index.ts', 'src/_pages/home/index.ts',
  'src/widgets/header/index.ts', 'src/features/theme/index.ts',
  'src/entities/a/index.ts', 'src/entities/a/model/inner.ts',
  'src/entities/b/index.ts', 'src/shared/lib/index.ts', 'src/shared/config/index.ts',
  'src/components/legacy.ts',
];
for (const file of files) {
  const path = resolve(root, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, 'export const value = 1;\n');
}
await writeFile(resolve(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }));
const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: [createArchitectureConfig(root)] });

for (const [name, filename, source, allowed] of [
  ['route uses page public API', 'app/page.ts', '@/_pages/home', true],
  ['page uses lower entity public API', 'src/_pages/home/check.ts', '@/entities/a', true],
  ['relative import within slice', 'src/entities/a/check.ts', './model/inner', true],
  ['shared technical segments can compose', 'src/shared/lib/check.ts', '@/shared/config', true],
  ['entity cannot import page by alias', 'src/entities/a/check.ts', '@/_pages/home', false],
  ['entity cannot import page relatively', 'src/entities/a/check.ts', '../../_pages/home', false],
  ['same layer slices cannot import each other', 'src/entities/a/check.ts', '@/entities/b', false],
  ['same layer relative imports cannot bypass boundary', 'src/entities/a/check.ts', '../b', false],
  ['page cannot deep import entity by alias', 'src/_pages/home/check.ts', '@/entities/a/model/inner', false],
  ['page cannot deep import entity relatively', 'src/_pages/home/check.ts', '../../entities/a/model/inner', false],
  ['new code cannot import legacy', 'src/_pages/home/check.ts', '@/components/legacy', false],
  ['shared cannot import app', 'src/shared/lib/check.ts', '@/_app', false],
]) {
  test(name, async () => {
    const [result] = await eslint.lintText(`import { value } from '${source}';\nexport { value };\n`, { filePath: resolve(root, filename) });
    const errors = result.messages.filter((message) => message.severity === 2);
    if (allowed) assert.deepEqual(errors, [], JSON.stringify(result.messages));
    else assert.ok(errors.some((message) => message.ruleId?.startsWith('boundaries/')), JSON.stringify(result.messages));
  });
}
