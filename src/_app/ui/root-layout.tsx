import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import { fontInter, fontExo2, fontAzonix } from '@/shared/styles';
import { I18nProvider, type Locale } from '@/shared/i18n';
import { ThemeScript } from '@/shared/theme';
import { Header } from '@/widgets/header';
import { ThemeProvider } from '../providers';
import { SmoothScroll } from './smooth-scroll';
import style from './root-layout.module.scss';

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
    <html
      lang={locale}
      className={`${fontInter.variable} ${fontExo2.variable} ${fontAzonix.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style
          // Establish the default dark canvas before the external stylesheet
          // arrives. The script below switches it to light when needed.
          dangerouslySetInnerHTML={{
            __html:
              'html{background-color:#000;color-scheme:dark;color:#f8fafc}html[data-theme="light"]{background-color:#fff;color-scheme:light;color:#020617}',
          }}
        />
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
                <main className={style.main}>{children}</main>
              </SmoothScroll>
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
