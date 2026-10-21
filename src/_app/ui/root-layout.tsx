import type { ReactNode } from 'react';
import '@/shared/styles';
import { ThemeScript } from '@/shared/theme';
import { ThemeProvider } from '../providers';

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
