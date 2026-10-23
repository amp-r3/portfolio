import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const locales = ['en', 'ru', 'uz'];

const weatherContent = JSON.parse(await readFile(resolve('content/projects/weather.json'), 'utf8'));
const storeContent = JSON.parse(await readFile(resolve('content/projects/store.json'), 'utf8'));
const projects = [weatherContent, storeContent].sort((a, b) => a.order - b.order);

test('client barrel index.ts does not export server-only data functions', async () => {
  const content = await readFile(resolve('src/entities/project/index.ts'), 'utf8');
  assert.equal(content.includes('getProjects'), false, 'index.ts must not mention getProjects');
  assert.equal(content.includes('getProject'), false, 'index.ts must not mention getProject');
  assert.equal(content.includes('ProjectSourceError'), false, 'index.ts must not mention ProjectSourceError');
  assert.equal(content.includes('server-only'), false, 'index.ts must not import server-only');
  assert.ok(content.includes('isProjectId'), 'index.ts must export isProjectId');
  assert.ok(content.includes('projectIds'), 'index.ts must export projectIds');
  assert.ok(content.includes('ProjectCard'), 'index.ts must export ProjectCard');
  assert.ok(content.includes('BenefitCard'), 'index.ts must export BenefitCard');
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
  assert.equal(projects[0].id, 'weather', 'Order must be weather first');
  assert.equal(projects[1].id, 'store', 'Order must be store second');
  assert.equal(projects[0].order, 1);
  assert.equal(projects[1].order, 2);

  const weatherTitle = typeof weatherContent.title === 'string' ? weatherContent.title : weatherContent.title.en;
  const storeTitle = typeof storeContent.title === 'string' ? storeContent.title : storeContent.title.en;
  assert.equal(weatherTitle, 'My Weather App');
  assert.equal(storeTitle, 'Store App');

  assert.equal(weatherContent.links.live, 'https://my-pogoda.netlify.app/');
  assert.equal(storeContent.links.live, 'https://store-mauve-nine.vercel.app/');
  assert.equal(weatherContent.links.github, 'https://github.com/amp-r3/weather');
  assert.equal(storeContent.links.github, 'https://github.com/amp-r3/store');

  assert.ok(Array.isArray(weatherContent.technologies) && weatherContent.technologies.length > 5);
  assert.ok(Array.isArray(storeContent.technologies) && storeContent.technologies.length > 5);

  assert.ok(weatherContent.images.light && weatherContent.images.dark);
  assert.ok(storeContent.images.light && storeContent.images.dark);
});

for (const locale of locales) {
  test(`translations for locale "${locale}" resolve project descriptions and benefits`, () => {
    const weatherDesc = weatherContent.description[locale];
    assert.ok(typeof weatherDesc === 'string' && weatherDesc.length > 50, `Weather description missing for ${locale}`);

    const storeDesc = storeContent.description[locale];
    assert.ok(typeof storeDesc === 'string' && storeDesc.length > 50, `Store description missing for ${locale}`);

    const storeApiDesc = storeContent.benefits[0].description[locale];
    assert.match(storeApiDesc, /\{ ids, items \}/, 'Literal store benefit braces must be preserved');

    for (const project of projects) {
      assert.ok(Array.isArray(project.benefits) && project.benefits.length === 3);
      for (const benefit of project.benefits) {
        assert.ok(typeof benefit.icon === 'string' && benefit.icon.length > 0);
        assert.ok(typeof benefit.title[locale] === 'string' && benefit.title[locale].length > 0);
        assert.ok(typeof benefit.description[locale] === 'string' && benefit.description[locale].length > 0);
      }
    }
  });
}
