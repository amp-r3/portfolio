import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import globals from 'globals';
import { createArchitectureConfig } from './scripts/fsd-config.mjs';

export default defineConfig([
  globalIgnores([
    '.next/**', '.worktrees/**', 'dist/**', 'artifacts/**', 'next-env.d.ts',
    // Migration source only. Remove each exception as its code moves into FSD.
    'src/App.tsx', 'src/main.tsx', 'src/i18n.ts',
    'src/Pages/**', 'src/Routes/**', 'src/components/**', 'src/context/**',
    'src/hooks/**', 'src/data/**',
  ]),
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  { files: ['scripts/**/*.mjs', 'tests/**/*.mjs'], languageOptions: { globals: globals.node } },
  createArchitectureConfig(),
]);
