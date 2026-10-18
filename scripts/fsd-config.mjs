import boundaries from 'eslint-plugin-boundaries';
import { resolve } from 'node:path';

const layers = ['_app', '_pages', 'widgets', 'features', 'entities', 'shared'];

export function createArchitectureConfig(root = process.cwd()) {
  return {
    files: ['app/**/*.{ts,tsx}', 'src/{_app,_pages,widgets,features,entities,shared}/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/root-path': root,
      'boundaries/elements': [
        { type: 'routes', pattern: 'app' },
        { type: '_app', pattern: 'src/_app' },
        ...layers.slice(1).map((layer) => ({ type: layer, pattern: `src/${layer}/*`, capture: ['slice'] })),
      ],
      'import/resolver': { typescript: { project: resolve(root, 'tsconfig.json') } },
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        policies: [
          { from: { element: { type: 'routes' } }, allow: { to: { element: { type: layers, fileInternalPath: 'index{,.server,.client}.ts' } } } },
          ...layers.map((layer, index) => ({
            from: { element: { type: layer } },
            allow: { to: { element: {
              type: layer === 'shared' ? ['shared'] : layers.slice(index + 1),
              fileInternalPath: 'index{,.server,.client}.ts',
            } } },
          })),
        ],
      }],
    },
  };
}
