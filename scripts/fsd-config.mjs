import boundaries from 'eslint-plugin-boundaries';
import { resolve } from 'node:path';

const layers = ['_app', '_pages', 'widgets', 'features', 'entities', 'shared'];

export function createArchitectureConfig(root = process.cwd()) {
  return {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/root-path': root,
      'boundaries/elements': [
        { type: 'routes', pattern: 'app/**' },
        { type: '_app', pattern: 'src/_app/**' },
        { type: '_pages', pattern: 'src/_pages/*', capture: ['slice'] },
        { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
        { type: 'features', pattern: 'src/features/*', capture: ['slice'] },
        { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
      'import/resolver': { typescript: { project: resolve(root, 'tsconfig.json') } },
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // 1. Next.js route adapters can import public APIs of any layer below
            {
              from: { element: { type: 'routes' } },
              allow: {
                to: {
                  element: {
                    type: layers,
                    fileInternalPath: 'index{,.server,.client}.ts',
                  },
                },
              },
            },
            // 2. Application layer (_app) can import public APIs of layers below
            {
              from: { element: { type: '_app' } },
              allow: {
                to: {
                  element: {
                    type: ['_pages', 'widgets', 'features', 'entities', 'shared'],
                    fileInternalPath: 'index{,.server,.client}.ts',
                  },
                },
              },
            },
            // 3. Page composition (_pages) can import widgets, features, entities, shared
            {
              from: { element: { type: '_pages' } },
              allow: {
                to: {
                  element: {
                    type: ['widgets', 'features', 'entities', 'shared'],
                    fileInternalPath: 'index{,.server,.client}.ts',
                  },
                },
              },
            },
            // 4. Widgets can import features, entities, shared (strictly client API, no server data)
            {
              from: { element: { type: 'widgets' } },
              allow: {
                to: {
                  element: {
                    type: ['features', 'entities', 'shared'],
                    fileInternalPath: 'index{,.client}.ts',
                  },
                },
              },
            },
            // 5. Features can import entities, shared (strictly client API, no server data)
            {
              from: { element: { type: 'features' } },
              allow: {
                to: {
                  element: {
                    type: ['entities', 'shared'],
                    fileInternalPath: 'index{,.client}.ts',
                  },
                },
              },
            },
            // 6. Entities can import shared technical segments
            {
              from: { element: { type: 'entities' } },
              allow: {
                to: {
                  element: {
                    type: ['shared'],
                    fileInternalPath: 'index{,.client}.ts',
                  },
                },
              },
            },
            // 7. Shared technical segments can freely compose with each other
            {
              from: { element: { type: 'shared' } },
              allow: {
                to: {
                  element: {
                    type: ['shared'],
                  },
                },
              },
            },
          ],
        },
      ],
    },
  };
}
