import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';

const locales = ['en', 'ru', 'uz'];

const requiredProjectLabels = [
  'projects.labels.type.personal',
  'projects.labels.type.client',
  'projects.labels.type.learning',
  'projects.labels.status.live',
  'projects.labels.status.wip',
  'projects.labels.role.solo',
  'projects.labels.role.team',
  'projects.labels.period.present',
  'projects.labels.stackGroup.core',
  'projects.labels.stackGroup.data',
  'projects.labels.stackGroup.forms',
  'projects.labels.stackGroup.tooling',
  'projects.labels.section.features',
  'projects.labels.section.deepDive',
  'projects.labels.section.stack',
  'projects.labels.section.tryIt',
  'projects.labels.section.limitations',
];

function flattenMessages(value, prefix = '') {
  if (typeof value !== 'object' || value === null) return { [prefix]: value };

  return Object.entries(value).reduce((result, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return { ...result, ...flattenMessages(child, path) };
  }, {});
}

const messagesByLocale = Object.fromEntries(
  await Promise.all(
    locales.map(async (locale) => {
      const source = await readFile(resolve('messages', `${locale}.json`), 'utf8');
      return [locale, JSON.parse(source)];
    })
  )
);

const keysByLocale = Object.fromEntries(
  Object.entries(messagesByLocale).map(([locale, messages]) => [locale, Object.keys(flattenMessages(messages))])
);

test('all locales contain the same message keys', () => {
  const [referenceLocale, ...otherLocales] = locales;
  const referenceKeys = keysByLocale[referenceLocale].sort();

  for (const locale of otherLocales) {
    assert.deepEqual(keysByLocale[locale].sort(), referenceKeys, `Message keys differ for ${locale}`);
  }
});

for (const locale of locales) {
  test(`all project labels are present for ${locale}`, () => {
    const keys = new Set(keysByLocale[locale]);

    for (const key of requiredProjectLabels) {
      assert.ok(keys.has(key), `Missing message key: ${key} (${locale})`);
    }
  });
}

for (const locale of locales) {
  test(`all ${locale} messages are valid ICU`, () => {
    const messages = messagesByLocale[locale];
    const t = createTranslator({
      locale,
      messages,
      onError(error) {
        throw error;
      },
    });

    for (const key of keysByLocale[locale]) {
      assert.doesNotThrow(
        () => t.rich(key, { code: (chunks) => chunks, title: 'Project' }),
        `${locale}: ${key}`
      );
    }
  });
}
