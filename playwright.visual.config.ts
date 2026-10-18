import { defineConfig } from '@playwright/test';

const candidate = process.env.VISUAL_TARGET === 'candidate';
const recording = process.env.BASELINE_RECORD === '1';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: recording ? 'artifacts/baseline/videos' : 'artifacts/visual',
  snapshotPathTemplate: '{testDir}/baseline/{arg}{ext}',
  updateSnapshots: 'none',
  timeout: 90_000,
  expect: { timeout: 10_000, toMatchSnapshot: { threshold: 0, maxDiffPixels: 0 } },
  fullyParallel: true,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'artifacts/visual-report', open: 'never' }]],
  use: {
    browserName: 'chromium',
    baseURL: candidate ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:4173',
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'Asia/Tashkent',
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    trace: 'retain-on-failure',
    video: recording ? 'on' : 'off',
  },
  webServer: {
    command: candidate ? 'pnpm start --hostname 127.0.0.1' : 'pnpm baseline:start',
    url: candidate ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
