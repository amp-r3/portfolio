import type { Metadata, Viewport } from 'next';

const title = 'Amir | Frontend Developer';
const description =
  'Frontend developer working with React, Next.js and TypeScript. I build responsive interfaces, connect them to APIs, and I am open to junior frontend roles.';
const url = 'https://amp-r3.is-a.dev';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: '%s | Amir',
  },
  description,
  keywords:
    'Frontend, React, Next.js, TypeScript, Junior Frontend Developer, Portfolio, Amir, Uzbekistan',
  authors: [{ name: 'Amir' }],
  alternates: {
    canonical: url,
    languages: {
      en: '/en',
      ru: '/ru',
      uz: '/uz',
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: { type: 'website', url, title, description },
  twitter: { card: 'summary_large_image', title, description },
  other: { title, 'twitter:url': url },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
