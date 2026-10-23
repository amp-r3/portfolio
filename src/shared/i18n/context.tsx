'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import type { Locale } from './routing';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isNotFound: boolean;
  setIsNotFound: (isNotFound: boolean) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue | null {
  return useContext(I18nContext);
}

export function useSetNotFound(): void {
  const context = useContext(I18nContext);

  useEffect(() => {
    context?.setIsNotFound(true);
    return () => {
      context?.setIsNotFound(false);
    };
  }, [context]);
}

interface I18nProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  messages: Record<Locale, AbstractIntlMessages>;
}

export function I18nProvider({ children, initialLocale, messages }: I18nProviderProps) {
  const [prevInitialLocale, setPrevInitialLocale] = useState(initialLocale);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isNotFound, setIsNotFound] = useState(false);

  if (prevInitialLocale !== initialLocale) {
    setPrevInitialLocale(initialLocale);
    setLocaleState(initialLocale);
  }

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, isNotFound, setIsNotFound }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Tashkent">
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
