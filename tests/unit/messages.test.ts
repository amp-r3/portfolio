import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';

const locales = ['en', 'ru', 'uz'] as const;

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

function flattenMessages(value: unknown, prefix = ''): Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return { [prefix]: value };

  return Object.entries(value as Record<string, unknown>).reduce((result, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return { ...result, ...flattenMessages(child, path) };
  }, {});
}

describe('i18n Message catalogs', async () => {
  const messagesByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => {
        const source = await readFile(resolve(process.cwd(), 'messages', `${locale}.json`), 'utf8');
        return [locale, JSON.parse(source)];
      })
    )
  );

  const keysByLocale = Object.fromEntries(
    Object.entries(messagesByLocale).map(([locale, messages]) => [locale, Object.keys(flattenMessages(messages))])
  );

  it('all locales contain exactly the same message keys', () => {
    const [referenceLocale, ...otherLocales] = locales;
    const referenceKeys = keysByLocale[referenceLocale].sort();

    for (const locale of otherLocales) {
      expect(keysByLocale[locale].sort()).toEqual(referenceKeys);
    }
  });

  for (const locale of locales) {
    it(`all project labels are present for ${locale}`, () => {
      const keys = new Set(keysByLocale[locale]);

      for (const key of requiredProjectLabels) {
        expect(keys.has(key), `Missing message key: ${key} (${locale})`).toBe(true);
      }
    });
  }

  for (const locale of locales) {
    it(`all ${locale} messages are valid ICU`, () => {
      const messages = messagesByLocale[locale];
      const t = createTranslator({
        locale,
        messages,
        onError(error) {
          throw error;
        },
      });

      const keys = keysByLocale[locale];
      for (const key of keys) {
        expect(() => t.rich(key, { code: (chunks) => chunks, title: 'Project' })).not.toThrow();
      }
    });
  }
});
