import * as rootParams from 'next/root-params';
import { getRequestConfig } from 'next-intl/server';
import { isLocale } from '@/shared/i18n';

export default getRequestConfig(async ({ locale }) => {
  let resolvedLocale = locale;

  if (!resolvedLocale) {
    const requested = await rootParams.locale();
    resolvedLocale = isLocale(requested) ? requested : 'en';
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../../../messages/${resolvedLocale}.json`)).default,
  };
});
