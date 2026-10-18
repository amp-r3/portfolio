import { test, expect } from '@playwright/test';
import { menuButton, openPage, viewports } from './helpers';

for (const viewport of [viewports[0], viewports[2]]) {
  test(`@record motion ${viewport.width}`, async ({ browser }, testInfo) => {
    test.skip(process.env.BASELINE_RECORD !== '1', 'Run pnpm baseline:record.');
    const context = await browser.newContext({
      viewport,
      baseURL: 'http://127.0.0.1:4173',
      deviceScaleFactor: 1,
      locale: 'en-US',
      timezoneId: 'Asia/Tashkent',
      colorScheme: 'light',
      recordVideo: { dir: 'artifacts/baseline/videos', size: viewport },
    });
    const page = await context.newPage();
    try {
      await openPage(page, '/', 'en', 'dark', false);
      await page.mouse.wheel(0, 650);
      await page.waitForTimeout(3000);
      await page.locator('#skills').scrollIntoViewIfNeeded();
      await page.waitForTimeout(4000);
      const mobile = viewport.width < 992;
      if (mobile) {
        await menuButton(page).click();
        await expect(page.locator('body')).toHaveCSS('position', 'fixed');
      }
      await page.locator('label').filter({ has: page.locator('input[aria-label="Switch to light theme"]') }).click();
      await page.waitForTimeout(2500);
      if (mobile) {
        await menuButton(page).click();
        await page.waitForTimeout(1500);
        await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
      }
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      if (mobile) {
        await menuButton(page).click();
        await page.waitForTimeout(1500);
        await menuButton(page).click();
      }
      await page.locator('a[href="/project/weather"]').click();
      await expect(page.locator('article h1')).toContainText('Weather');
    } finally {
      await context.close();
      const video = await page.video()?.path();
      if (video) await testInfo.attach(`motion-${viewport.width}`, { path: video, contentType: 'video/webm' });
    }
  });
}
