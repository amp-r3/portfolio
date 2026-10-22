import { test, expect } from '@playwright/test';

test.describe('Stage 2: Styles, Fonts, Assets, and Theme', () => {
  test('global styles, CSS custom properties, and container rules are applied', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main');
    await expect(main).toHaveCSS('position', 'relative');
    await expect(main).toHaveCSS('overflow', 'hidden');

    const container = page.locator('.container').first();
    await expect(container).toHaveCSS('max-width', '1440px');

    const html = page.locator('html');
    await expect(html).toHaveCSS('background-color', 'rgb(0, 0, 0)');

    const body = page.locator('body');
    await expect(body).toHaveCSS('font-family', /Inter/);
  });

  test('fonts (Inter, Exo2, Azonix) are loaded and available in document.fonts', async ({ page }) => {
    await page.goto('/');

    const fontsLoaded = await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('16px Inter'),
        document.fonts.load('16px Exo2'),
        document.fonts.load('16px Azonix'),
      ]);
      await document.fonts.ready;
      return {
        Inter: document.fonts.check('16px Inter'),
        Exo2: document.fonts.check('16px Exo2'),
        Azonix: document.fonts.check('16px Azonix'),
      };
    });

    expect(fontsLoaded.Inter).toBe(true);
    expect(fontsLoaded.Exo2).toBe(true);
    expect(fontsLoaded.Azonix).toBe(true);
  });

  test('theme switch SVG icons are loaded in the browser', async ({ page, request }) => {
    await page.goto('/');

    const sun = page.locator('img[alt="Sun"]');
    const moon = page.locator('img[alt="Moon"]');
    await expect(sun).toBeVisible();
    await expect(moon).toBeVisible();

    const sunSrc = await sun.getAttribute('src');
    const moonSrc = await moon.getAttribute('src');

    expect(sunSrc).toBeTruthy();
    expect(moonSrc).toBeTruthy();

    const resSun = await request.get(sunSrc!);
    expect(resSun.status()).toBe(200);

    const resMoon = await request.get(moonSrc!);
    expect(resMoon.status()).toBe(200);
  });

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`first visit defaults to dark with system ${colorScheme}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      await page.emulateMedia({ colorScheme });
      await page.goto('/');

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.getByRole('checkbox', { name: 'Switch to light theme' })).not.toBeChecked();
      await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
      expect(consoleErrors).toEqual([]);
    });
  }

  test('cold visit with saved light theme applies data-theme before paint and without hydration mismatch', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });

    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('checkbox', { name: 'Switch to dark theme' })).toBeChecked();
    await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
    expect(consoleErrors).toEqual([]);
  });

  test('interactive theme switching toggles data-theme, checkbox, and localStorage', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const checkbox = page.getByRole('checkbox', { name: 'Switch to light theme' });
    await expect(checkbox).not.toBeChecked();

    // Click Light label to switch to light theme
    await page.getByText('Light', { exact: true }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('checkbox', { name: 'Switch to dark theme' })).toBeChecked();

    const storedTheme1 = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme1).toBe('light');

    // Click Dark label to switch back to dark theme
    await page.getByText('Dark', { exact: true }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('checkbox', { name: 'Switch to light theme' })).not.toBeChecked();

    const storedTheme2 = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme2).toBe('dark');
  });

  test('denied localStorage keeps content visible and defaults to dark', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('Storage denied', 'SecurityError');
        },
      });
    });

    await page.goto('/');
    await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(pageErrors).toEqual([]);
  });
});
