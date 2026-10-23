import type { Metadata, Viewport } from 'next';

const title = 'Amir Ergashev | Frontend Developer';
const description = "I'm a Junior Web Developer specializing in Front-End technologies, enthusiastic about turning creative ideas into beautiful and functional code.";
const url = 'https://amp3re.netlify.app/';
const image = `${url}og-image.png`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s | Amir Ergashev',
  },
  description,
  keywords: 'Frontend, React, Next.js, TypeScript, Redux Toolkit, Web Development, Portfolio, Amir Ergashev, Uzbekistan',
  authors: [{ name: 'Amir Ergashev' }],
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
  openGraph: { type: 'website', url, title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
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
