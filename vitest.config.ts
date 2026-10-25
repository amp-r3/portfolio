import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      'server-only': path.resolve(import.meta.dirname, './node_modules/server-only/empty.js'),
      'next/navigation': 'next/navigation.js',
      'next/image': 'next/image.js',
      'next/link': 'next/link.js',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      'server-only': path.resolve(import.meta.dirname, './node_modules/server-only/empty.js'),
      'next/navigation': 'next/navigation.js',
      'next/image': 'next/image.js',
      'next/link': 'next/link.js',
    },
  },
});
