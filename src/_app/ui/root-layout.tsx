import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/shared/styles';
import type { Locale } from '@/shared/i18n';
import { ThemeScript } from '@/shared/theme';
import { Header } from '@/widgets/header';
import { ThemeProvider } from '../providers';
import { SmoothScroll } from './smooth-scroll';

interface RootLayoutProps {
  children: ReactNode;
  locale: Locale;
}

export async function RootLayout({ children, locale }: RootLayoutProps) {
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        {/* Browser extensions (for example ColorZilla's cz-shortcut-listen)
            can add attributes before hydration. They are not part of the app. */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <div id="root">
              <Header />
              <SmoothScroll>
                <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>{children}</main>
              </SmoothScroll>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
