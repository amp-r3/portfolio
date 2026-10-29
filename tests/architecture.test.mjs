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
  'app/page.ts',
  'src/_app/index.ts',
  'src/_pages/home/index.ts',
  'src/_pages/home/check.ts',
  'src/widgets/header/index.ts',
  'src/widgets/header/check.ts',
  'src/widgets/hero/index.ts',
  'src/features/theme/index.ts',
  'src/features/theme/check.ts',
  'src/features/lang/index.ts',
  'src/entities/a/index.ts',
  'src/entities/a/index.server.ts',
  'src/entities/a/model/inner.ts',
  'src/entities/a/check.ts',
  'src/entities/b/index.ts',
  'src/shared/lib/index.ts',
  'src/shared/lib/check.ts',
  'src/shared/config/index.ts',
  'src/shared/ui/index.ts',
  'src/components/legacy.ts',
];

for (const file of files) {
  const path = resolve(root, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, 'export const value = 1;\n');
}

await writeFile(
  resolve(root, 'tsconfig.json'),
  JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } } })
);

const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  overrideConfig: [createArchitectureConfig(root)],
});

const testCases = [
  ['route uses page public API', 'app/page.ts', '@/_pages/home', true],
  ['page uses lower entity public API', 'src/_pages/home/check.ts', '@/entities/a', true],
  ['relative import within slice', 'src/entities/a/check.ts', './model/inner', true],
  ['shared technical segments can compose', 'src/shared/lib/check.ts', '@/shared/config', true],
  ['page uses lower entity server public API', 'src/_pages/home/check.ts', '@/entities/a/index.server', true],
  ['widget uses feature public API', 'src/widgets/header/check.ts', '@/features/theme', true],
  ['feature uses entity public API', 'src/features/theme/check.ts', '@/entities/a', true],
  ['entity cannot import page by alias', 'src/entities/a/check.ts', '@/_pages/home', false],
  ['entity cannot import page relatively', 'src/entities/a/check.ts', '../../_pages/home', false],
  ['same layer slices cannot import each other (entities)', 'src/entities/a/check.ts', '@/entities/b', false],
  ['same layer relative imports cannot bypass boundary', 'src/entities/a/check.ts', '../b', false],
  ['same layer slices cannot import each other (widgets)', 'src/widgets/header/check.ts', '@/widgets/hero', false],
  ['same layer slices cannot import each other (features)', 'src/features/theme/check.ts', '@/features/lang', false],
  ['features cannot import widgets', 'src/features/theme/check.ts', '@/widgets/header', false],
  ['page cannot deep import entity by alias', 'src/_pages/home/check.ts', '@/entities/a/model/inner', false],
  ['page cannot deep import entity relatively', 'src/_pages/home/check.ts', '../../entities/a/model/inner', false],
  ['shared cannot import entity server public API', 'src/shared/lib/check.ts', '@/entities/a/index.server', false],
  ['widgets cannot import entity server public API', 'src/widgets/header/check.ts', '@/entities/a/index.server', false],
  ['features cannot import entity server public API', 'src/features/theme/check.ts', '@/entities/a/index.server', false],
  ['new code cannot import legacy', 'src/_pages/home/check.ts', '@/components/legacy', false],
  ['shared cannot import app', 'src/shared/lib/check.ts', '@/_app', false],
  ['shared cannot import widgets', 'src/shared/lib/check.ts', '@/widgets/header', false],
];

for (const [name, filename, source, allowed] of testCases) {
  test(name, async () => {
    const [result] = await eslint.lintText(
      `import { value } from '${source}';\nexport { value };\n`,
      { filePath: resolve(root, filename) }
    );
    const errors = result.messages.filter((message) => message.severity === 2);
    if (allowed) {
      assert.deepEqual(errors, [], JSON.stringify(result.messages));
    } else {
      assert.ok(
        errors.some((message) => message.ruleId?.startsWith('boundaries/')),
        JSON.stringify(result.messages)
      );
    }
  });
}

test('all real project files comply with FSD boundaries', async () => {
  const projectEslint = new ESLint();
  const results = await projectEslint.lintFiles(['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}']);
  const boundaryErrors = results
    .flatMap((r) => r.messages)
    .filter((m) => m.severity === 2 && m.ruleId?.startsWith('boundaries/'));

  assert.deepEqual(boundaryErrors, [], `Found FSD boundary violations in real codebase: ${JSON.stringify(boundaryErrors)}`);
});
