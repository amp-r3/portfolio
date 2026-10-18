import { test, expect } from '@playwright/test';
import { menuButton, openPage, viewports } from './helpers';

for (const viewport of [viewports[0], viewports[2]]) {
  test(`@record motion ${viewport.width}`, async ({ page }) => {
    test.skip(process.env.BASELINE_RECORD !== '1', 'Run pnpm baseline:record.');
    await page.setViewportSize(viewport);
    await openPage(page, '/', 'en', 'dark', false);
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(3000);
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
    await page.getByRole('checkbox', { name: 'Switch to light theme' }).check();
    await page.waitForTimeout(2500);
    if (viewport.width < 992) {
      await menuButton(page).click();
      await page.waitForTimeout(1500);
      await menuButton(page).click();
    }
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.locator('a[href="/project/weather"]').click();
    await expect(page.locator('article h1')).toContainText('Weather');
  });
}
