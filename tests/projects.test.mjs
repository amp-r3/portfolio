import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';

const locales = ['en', 'ru', 'uz'];

const messagesByLocale = Object.fromEntries(
  await Promise.all(
    locales.map(async (locale) => {
      const source = await readFile(resolve('messages', `${locale}.json`), 'utf8');
      return [locale, JSON.parse(source)];
    })
  )
);

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

test('raw projects data preserves required order and fields', async () => {
  const rawProjectsFile = await readFile(resolve('src/entities/project/model/raw-projects.ts'), 'utf8');
  assert.match(rawProjectsFile, /id:\s*'weather'[\s\S]*id:\s*'store'/, 'Order must be weather first, then store');
  assert.match(rawProjectsFile, /title:\s*'My Weather App'/);
  assert.match(rawProjectsFile, /title:\s*'Store App'/);
  assert.match(rawProjectsFile, /demoLink:\s*'https:\/\/my-pogoda\.netlify\.app\/'/);
  assert.match(rawProjectsFile, /demoLink:\s*'https:\/\/amp-r3-store\.netlify\.app\/'/);
  assert.match(rawProjectsFile, /githubLink:\s*'https:\/\/github\.com\/amp-r3\/weather'/);
  assert.match(rawProjectsFile, /githubLink:\s*'https:\/\/github\.com\/amp-r3\/store'/);
});

for (const locale of locales) {
  test(`translations for locale "${locale}" resolve project descriptions and benefits`, () => {
    const messages = messagesByLocale[locale];
    const t = createTranslator({
      locale,
      messages,
      onError(error) {
        throw error;
      },
    });

    const weatherDesc = t('projects.weatherDescription');
    assert.ok(typeof weatherDesc === 'string' && weatherDesc.length > 50);

    const storeDesc = t('projects.storeDescription');
    assert.ok(typeof storeDesc === 'string' && storeDesc.length > 50);

    const storeApiDesc = t('projects.benefits.store.api.description');
    assert.match(storeApiDesc, /\{ ids, items \}/, 'Literal store benefit braces must be preserved');

    for (const key of [
      'projects.benefits.weather.geo.title',
      'projects.benefits.weather.geo.description',
      'projects.benefits.weather.adaptive.title',
      'projects.benefits.weather.adaptive.description',
      'projects.benefits.weather.performance.title',
      'projects.benefits.weather.performance.description',
      'projects.benefits.store.api.title',
      'projects.benefits.store.api.description',
      'projects.benefits.store.url.title',
      'projects.benefits.store.url.description',
      'projects.benefits.store.architecture.title',
      'projects.benefits.store.architecture.description',
    ]) {
      const value = t(key);
      assert.ok(typeof value === 'string' && value.length > 0, `Missing translation for ${key}`);
    }
  });
}
