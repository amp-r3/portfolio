import { test, expect } from '@playwright/test';

test('direct entry, refresh, client navigation and browser history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const id of ['weather', 'store']) {
    const response = await page.goto(`/project/${id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: `Project: ${id}` })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: `Project: ${id}` })).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Portfolio', exact: true })).toBeVisible();
    await page.getByRole('link', { name: id, exact: true }).click();
    await expect(page.getByRole('heading', { name: `Project: ${id}` })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Portfolio', exact: true })).toBeVisible();
    await page.goForward();
    await expect(page.getByRole('heading', { name: `Project: ${id}` })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const path of ['/project/unknown', '/unknown', '/project/weather/extra']) {
  test(`HTTP 404 and recovery for ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Portfolio', exact: true })).toBeVisible();
  });
}

test('metadata and public assets retain original values', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Amir Ergashev | Frontend Developer');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', "I'm a Junior Web Developer specializing in Front-End technologies, enthusiastic about turning creative ideas into beautiful and functional code.");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://amp3re.netlify.app/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://amp3re.netlify.app/og-image.png');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
  for (const path of ['/favicon.ico', '/favicon-16x16.png', '/favicon-32x32.png', '/apple-touch-icon.png', '/site.webmanifest', '/og-image.png']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).not.toContain('text/html');
  }
  const manifest = await (await request.get('/site.webmanifest')).json() as { icons: { src: string }[] };
  for (const icon of manifest.icons) {
    expect(icon.src).toMatch(/^\//);
    expect((await request.get(icon.src)).status()).toBe(200);
  }
});
