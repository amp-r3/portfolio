import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

const withNextIntl = createNextIntlPlugin('./src/_app/i18n/request.ts');

export default withNextIntl(nextConfig);
