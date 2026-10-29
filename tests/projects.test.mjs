import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const locales = ['en', 'ru', 'uz'];

const palmaContent = JSON.parse(await readFile(resolve('content/projects/palma.json'), 'utf8'));
const storeContent = JSON.parse(await readFile(resolve('content/projects/store.json'), 'utf8'));
const projects = [palmaContent, storeContent].sort((a, b) => a.order - b.order);

test('client barrel index.ts does not export server-only data functions', async () => {
  const content = await readFile(resolve('src/entities/project/index.ts'), 'utf8');
  assert.equal(content.includes('getProjects'), false, 'index.ts must not mention getProjects');
  assert.equal(content.includes('getProject'), false, 'index.ts must not mention getProject');
  assert.equal(content.includes('ProjectSourceError'), false, 'index.ts must not mention ProjectSourceError');
  assert.equal(content.includes('server-only'), false, 'index.ts must not import server-only');
  assert.ok(content.includes('isProjectId'), 'index.ts must export isProjectId');
  assert.ok(content.includes('projectIds'), 'index.ts must export projectIds');
  assert.ok(content.includes('ProjectCard'), 'index.ts must export ProjectCard');
});

test('server modules declare server-only protection', async () => {
  const serverIndex = await readFile(resolve('src/entities/project/index.server.ts'), 'utf8');
  assert.match(serverIndex, /import ['"]server-only['"];/, 'index.server.ts must declare server-only');
  assert.match(serverIndex, /export \{.*getProject.*\} from/, 'index.server.ts must export getProject');
  assert.match(serverIndex, /export \{.*getProjects.*\} from/, 'index.server.ts must export getProjects');
  assert.match(serverIndex, /ProjectSourceError/, 'index.server.ts must export ProjectSourceError');

  const apiModule = await readFile(resolve('src/entities/project/api/get-projects.ts'), 'utf8');
  assert.match(apiModule, /import ['"]server-only['"];/, 'get-projects.ts must declare server-only');
});

test('legacy raw-projects.ts file is deleted', async () => {
  await assert.rejects(
    () => readFile(resolve('src/entities/project/model/raw-projects.ts'), 'utf8'),
    { code: 'ENOENT' },
    'raw-projects.ts should no longer exist'
  );
});

test('project content preserves required order and fields', () => {
  assert.equal(projects[0].id, 'palma', 'Order must be palma first');
  assert.equal(projects[1].id, 'store', 'Order must be store second');
  assert.equal(projects[0].order, 1);
  assert.equal(projects[1].order, 2);

  assert.equal(palmaContent.title.en, 'Palma UC');
  assert.equal(storeContent.title.en, 'Store App');

  assert.equal(palmaContent.links.live, 'https://palma-uc.store/');
  assert.equal(storeContent.links.live, 'https://store-mauve-nine.vercel.app/');
  assert.equal(palmaContent.links.github, undefined);
  assert.equal(storeContent.links.github, 'https://github.com/amp-r3/store');

  for (const project of projects) {
    assert.ok(Array.isArray(project.stack.primary) && project.stack.primary.length === 5);
    assert.ok(Array.isArray(project.stack.groups) && project.stack.groups.length > 0);
    assert.ok(Array.isArray(project.features));
    assert.ok(Array.isArray(project.deepDive) && project.deepDive.length > 0);

    const groupedItems = new Set(project.stack.groups.flatMap((group) => group.items));
    for (const item of project.stack.primary) {
      assert.ok(groupedItems.has(item), `Primary stack item "${item}" must be present in stack.groups`);
    }

    assert.equal('description' in project, false, 'Legacy description key must be removed');
    assert.equal('technologies' in project, false, 'Legacy technologies key must be removed');
    assert.equal('benefits' in project, false, 'Legacy benefits key must be removed');
  }

  assert.equal(palmaContent.features.length, 6);
  assert.equal(palmaContent.deepDive.length, 5);
  assert.equal(palmaContent.tryIt?.length, 3);
  assert.equal(palmaContent.limitations?.length, 4);

  assert.equal(storeContent.features.length, 6);
  assert.equal(storeContent.deepDive.length, 5);
  assert.equal(storeContent.tryIt?.length, 3);

  assert.deepEqual(palmaContent.images, {
    desktop: 'palmaDark',
    mobile: 'palmaMobileDark',
  });
  assert.deepEqual(storeContent.images, {
    desktop: 'storeDark',
    mobile: 'storeMobileDark',
  });

  assert.equal(palmaContent.type, 'personal');
  assert.equal(palmaContent.status, 'live');
  assert.deepEqual(palmaContent.period, { start: 2026 });
  assert.equal(palmaContent.role, 'solo');

  assert.equal(storeContent.type, 'personal');
  assert.equal(storeContent.status, 'live');
  assert.deepEqual(storeContent.period, { start: 2025, end: 2026 });
  assert.equal(storeContent.role, 'solo');
});

for (const locale of locales) {
  test(`translations for locale "${locale}" resolve project taglines, SEO and deep dives`, () => {
    for (const project of projects) {
      const tagline = project.tagline[locale];
      assert.ok(typeof tagline === 'string' && tagline.length > 50, `Tagline missing for ${project.id} (${locale})`);

      const seoDescription = project.seo.description[locale];
      assert.ok(typeof seoDescription === 'string' && seoDescription.length > 0);
      assert.ok(seoDescription.length <= 160, `SEO description too long for ${project.id} (${locale})`);

      for (const entry of project.deepDive) {
        assert.ok(typeof entry.icon === 'string' && entry.icon.length > 0);
        assert.ok(typeof entry.title[locale] === 'string' && entry.title[locale].length > 0);
        assert.ok(typeof entry.summary[locale] === 'string' && entry.summary[locale].length > 0);
        assert.ok(typeof entry.details[locale] === 'string' && entry.details[locale].length > 0);
      }
    }

    const storeApiDetails = storeContent.deepDive[0].details[locale];
    assert.match(storeApiDetails, /\{ ids, items \}/, 'Literal store braces must be preserved');

    for (const project of [palmaContent, storeContent]) {
      if (project.tryIt) {
        for (const step of project.tryIt) {
          assert.ok(typeof step.text[locale] === 'string' && step.text[locale].length > 0);
          if (step.title) {
            assert.ok(typeof step.title[locale] === 'string' && step.title[locale].length > 0);
            assert.ok(
              step.title[locale].length <= 32,
              `TryIt title too long for ${project.id} (${locale}): "${step.title[locale]}"`
            );
          }
        }
      }
    }
  });
}
