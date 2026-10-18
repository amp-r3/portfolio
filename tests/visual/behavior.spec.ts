import { test, expect } from '@playwright/test';
import { menuButton, openPage } from './helpers';

test('baseline navigation, language and resource contract', async ({ page }) => {
  test.skip(process.env.VISUAL_TARGET === 'candidate', 'Legacy behavior is a record, not the final localized navigation contract.');
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page, '/');
  await expect(page.locator('footer')).toHaveCount(1);
  await page.locator('a[href="#skills"]').click();
  await expect(page).toHaveURL(/#skills$/);
  // The source manually pushes null history state for anchors. Start a clean
  // router entry before independently checking project back/forward behavior.
  await page.goto('/');
  await page.locator('a[href="/project/weather"]').click();
  await expect(page.locator('article h1')).toContainText('Weather');
  await expect(page.locator('footer')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('article h1')).toContainText('Weather');
  await page.getByRole('button', { name: 'Change language' }).click();
  await expect(page.getByRole('button', { name: 'Change language' })).toHaveText('RU');
  await expect(page).toHaveURL(/\/project\/weather$/);
  await page.getByRole('button', { name: 'Go back', exact: true }).click();
  await expect(page.locator('#hero')).toBeVisible();
  await page.goForward();
  await expect(page.locator('article h1')).toContainText('Weather');
  // Test the project page's header anchor separately from browser history.
  await page.goto('/project/weather');
  await page.locator('a[href="#skills"]').click();
  await expect(page).toHaveURL(/\/project\/weather$/);
  await page.goto('/project/store');
  await expect(page.locator('article h1')).toContainText('Store');
  await expect(page.getByRole('button', { name: 'Change language' })).toHaveText('EN');
  const links = page.locator('article a[target="_blank"]');
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) await expect(link).toHaveAttribute('href', /^https:\/\//);
  for (const path of ['/project/missing', '/missing']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.locator('footer')).toHaveCount(0);
  }
  await page.getByRole('link', { name: 'Return to Homepage' }).click();
  await expect(page.locator('#hero')).toBeVisible();
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`first visit defaults to dark with system ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('checkbox', { name: 'Switch to light theme' })).not.toBeChecked();
    await expect(page.locator('#hero h1')).toBeVisible();
  });
}

test('saved theme survives reload and switches screenshot variants', async ({ page }) => {
  await openPage(page, '/project/store', 'en', 'light', false);
  const image = page.locator('article picture img');
  await expect(image).toHaveAttribute('src', /storeLight/);
  await page.getByText('Dark', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(image).toHaveAttribute('src', /storeDark/);
  // Remove the test's theme initializer before testing persistence in a new tab.
  const next = await page.context().newPage();
  await next.goto('/project/store');
  await expect(next.locator('html')).toHaveAttribute('data-theme', 'dark');
  await next.close();
});

test('denied localStorage keeps content visible and defaults to dark', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage denied', 'SecurityError'); } });
  });
  await page.goto('/');
  await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('mobile menu locks scroll and anchor closes it', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPage(page, '/');
  await menuButton(page).click();
  await expect(page.locator('body')).toHaveCSS('position', 'fixed');
  await page.locator('a[href="#projects"]').first().click();
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  await expect(page).toHaveURL(/#projects$/);
});
