import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';

const locales = ['en', 'ru', 'uz'];

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
        () => t.rich(key, { code: (chunks) => chunks }),
        `${locale}: ${key}`
      );
    }
  });

  test(`${locale} preserves the literal store benefit braces`, () => {
    const messages = messagesByLocale[locale];
    const description = messages.projects.benefits.store.api.description;

    assert.match(description, /\{ ids, items \}/);
  });
}
