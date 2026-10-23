import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import '@/shared/styles';
import { I18nProvider, type Locale } from '@/shared/i18n';
import { ThemeScript } from '@/shared/theme';
import { Header } from '@/widgets/header';
import { ThemeProvider } from '../providers';
import { SmoothScroll } from './smooth-scroll';

interface RootLayoutProps {
  children: ReactNode;
  locale: Locale;
}

async function loadAllMessages(): Promise<Record<Locale, AbstractIntlMessages>> {
  const [en, ru, uz] = await Promise.all([
    import(`../../../messages/${'en'}.json`),
    import(`../../../messages/${'ru'}.json`),
    import(`../../../messages/${'uz'}.json`),
  ]);

  return {
    en: en.default,
    ru: ru.default,
    uz: uz.default,
  };
}

export async function RootLayout({ children, locale }: RootLayoutProps) {
  const allMessages = await loadAllMessages();

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        {/* Browser extensions (for example ColorZilla's cz-shortcut-listen)
            can add attributes before hydration. They are not part of the app. */}
        <I18nProvider initialLocale={locale} messages={allMessages}>
          <ThemeProvider>
            <div id="root">
              <Header />
              <SmoothScroll>
                <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>{children}</main>
              </SmoothScroll>
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
