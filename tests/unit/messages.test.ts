import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';

const locales = ['en', 'ru', 'uz'] as const;

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
        expect(() => t.rich(key, { code: (chunks) => chunks })).not.toThrow();
      }
    });

    it(`${locale} preserves the literal store benefit braces`, () => {
      const messages = messagesByLocale[locale] as {
        projects: {
          benefits: {
            store: {
              api: {
                description: string;
              };
            };
          };
        };
      };
      const description = messages.projects.benefits.store.api.description;
      expect(description).toMatch(/\{ ids, items \}/);
    });
  }
});
