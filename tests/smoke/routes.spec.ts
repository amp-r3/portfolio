import { test, expect } from '@playwright/test';

const projectTitles = {
  weather: 'My Weather App',
  store: 'Store App',
} as const;

test('legacy URLs redirect to the default locale and preserve query and hash', async ({ page, request }) => {
  const root = await request.get('/?source=legacy', { maxRedirects: 0 });
  expect([307, 308]).toContain(root.status());
  expect(root.headers().location).toBe('/en?source=legacy');

  const project = await request.get('/project/weather?source=legacy', { maxRedirects: 0 });
  expect([307, 308]).toContain(project.status());
  expect(project.headers().location).toBe('/en/project/weather?source=legacy');

  await page.goto('/#skills');
  await expect(page).toHaveURL(/\/en#skills$/);

  const response = await page.goto('/project/weather#top');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/en\/project\/weather#top$/);
});

test('direct entry, refresh, project navigation and browser history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  for (const [id, title] of Object.entries(projectTitles)) {
    const response = await page.goto('/en');
    // Firefox revalidates the cached static document on repeat visits and may
    // report 304 even though the cached page is then rendered normally.
    expect([200, 304]).toContain(response?.status());
    await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
    await expect(page.locator('footer')).toHaveCount(1);

    await page.locator(`a[href="/en/project/${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/en/project/${id}$`));
    await expect(page.locator('article h1')).toHaveText(title);
    await expect(page.locator('footer')).toHaveCount(0);

    await page.getByRole('button', { name: 'Go back' }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('#hero h1')).toHaveText('Amir Ergashev');
    await expect(page.locator('footer')).toHaveCount(1);

    await page.goto(`/en/project/${id}`);
    await expect(page.locator('article h1')).toHaveText(title);
    await page.reload();
    await expect(page.locator('article h1')).toHaveText(title);

    await page.goto('/en');
    await page.locator(`a[href="/en/project/${id}"]`).click();
    await expect(page.locator('article h1')).toHaveText(title);
    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await page.goForward();
    await expect(page.locator('article h1')).toHaveText(title);
  }

  expect(errors).toEqual([]);
});

test('all locales serve the localized home page and html lang', async ({ page }) => {
  for (const locale of ['en', 'ru', 'uz']) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('#hero h1')).not.toBeEmpty();
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator(`a[href="/${locale}/project/weather"]`)).toBeVisible();
    await expect(page.locator(`a[href="/${locale}/project/store"]`)).toBeVisible();
  }
});

test('project details renders server-localized content, benefits, and literal braces', async ({ page }) => {
  for (const locale of ['en', 'ru', 'uz']) {
    await page.goto(`/${locale}/project/store`);
    await expect(page.locator('article h1')).toHaveText(projectTitles.store);
    await expect(page.locator('article p').first()).not.toBeEmpty();
    await expect(page.locator('article section')).toContainText('{ ids, items }');
    await expect(page.locator('a[href="https://amp-r3-store.netlify.app/"]')).toBeVisible();
    await expect(page.locator('a[href="https://github.com/amp-r3/store"]')).toBeVisible();
  }
});

test('language switch keeps the project route and scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/project/weather');
  await expect(page.locator('article h1')).toHaveText(projectTitles.weather);

  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  expect(scrollBefore).toBeGreaterThan(100);

  const switcher = page.getByRole('button', { name: 'Change language' });

  await switcher.click();
  await expect(page).toHaveURL(/\/ru\/project\/weather$/);
  await expect(switcher).toHaveText('RU');
  await expect(page.locator('article h1')).toHaveText(projectTitles.weather);

  const scrollAfterFirstSwitch = await page.evaluate(() => window.scrollY);
  expect(scrollAfterFirstSwitch).toBeGreaterThan(100);

  await switcher.click();
  await expect(page).toHaveURL(/\/uz\/project\/weather$/);
  await expect(switcher).toHaveText('UZ');
  await expect(page.locator('article h1')).toHaveText(projectTitles.weather);

  await switcher.click();
  await expect(page).toHaveURL(/\/en\/project\/weather$/);
  await expect(switcher).toHaveText('EN');
  await expect(page.locator('article h1')).toHaveText(projectTitles.weather);
});

test('header anchors, mobile menu and project-page anchors do not leave the route', async ({ page }) => {
  await page.goto('/en');
  await page.locator('a[href="#skills"]').click();
  await expect(page).toHaveURL(/\/en#skills$/);
  await expect(page.locator('#skills')).toBeInViewport();

  await page.locator('a[href="#projects"]').first().click();
  await expect(page).toHaveURL(/\/en#projects$/);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/project/weather');
  await page.locator('button').filter({ has: page.locator('svg line') }).click();
  await page.locator('a[href="#skills"]').click();
  await expect(page).toHaveURL(/\/en\/project\/weather$/);
});

test('localized 404 pages return HTTP 404 and preserve the design', async ({ page, request }) => {
  for (const [locale, homeLabel] of [
    ['en', 'Return to Homepage'],
    ['ru', 'На главную'],
    ['uz', 'Bosh sahifaga qaytish'],
  ] as const) {
    const response = await page.goto(`/${locale}/project/unknown`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('undefined', { exact: true })).toBeVisible();
    await expect(page.locator('footer')).toHaveCount(0);
    await expect(page.getByRole('link', { name: homeLabel })).toHaveAttribute('href', `/${locale}`);

    await page.reload();
    expect((await page.goto(`/${locale}/unknown`))?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  }

  const unknownLocale = await request.get('/de', { maxRedirects: 0 });
  expect([307, 308]).toContain(unknownLocale.status());
  expect(unknownLocale.headers().location).toBe('/en/de');

  const unknownLocalePage = await page.goto('/de');
  expect(unknownLocalePage?.status()).toBe(404);
  await expect(page).toHaveURL(/\/en\/de$/);
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});

test('language switch on 404 updates locale and content without failed-to-fetch or theme reset', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('the server responded with a status of 404')) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/en/project/unknown');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('link', { name: 'Return to Homepage' })).toBeVisible();

  const switcher = page.getByRole('button', { name: 'Change language' });
  await expect(switcher).toHaveText('EN');

  // Switch to RU
  await switcher.click();
  await expect(page).toHaveURL(/\/ru\/project\/unknown$/);
  await expect(switcher).toHaveText('RU');
  await expect(page.getByRole('link', { name: 'На главную' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Switch to UZ
  await switcher.click();
  await expect(page).toHaveURL(/\/uz\/project\/unknown$/);
  await expect(switcher).toHaveText('UZ');
  await expect(page.getByRole('link', { name: 'Bosh sahifaga qaytish' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Switch back to EN
  await switcher.click();
  await expect(page).toHaveURL(/\/en\/project\/unknown$/);
  await expect(switcher).toHaveText('EN');
  await expect(page.getByRole('link', { name: 'Return to Homepage' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  expect(consoleErrors).toEqual([]);
});

test('loader appears during an artificially slowed project navigation', async ({ page }) => {
  await page.route('**/*?_rsc=*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.goto('/en');
  await page.locator('a[href="/en/project/weather"]').click();

  const loaderVisible = await page
    .waitForFunction(
      () =>
        Array.from(document.querySelectorAll('div')).some((element) => {
          const style = getComputedStyle(element);
          return style.position === 'fixed' && style.zIndex === '9999';
        }),
      undefined,
      { timeout: 5000 }
    )
    .then(() => true)
    .catch(() => false);

  expect(loaderVisible).toBe(true);
  await expect(page.locator('article h1')).toHaveText(projectTitles.weather);
});

test('metadata and public assets retain original values', async ({ page, request }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle('Amir Ergashev | Frontend Developer');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    "I'm a Junior Web Developer specializing in Front-End technologies, enthusiastic about turning creative ideas into beautiful and functional code."
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://amp3re.netlify.app/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://amp3re.netlify.app/og-image.png'
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
  for (const path of [
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/site.webmanifest',
    '/og-image.png',
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).not.toContain('text/html');
  }
  const manifest = (await (await request.get('/site.webmanifest')).json()) as { icons: { src: string }[] };
  for (const icon of manifest.icons) {
    expect(icon.src).toMatch(/^\//);
    expect((await request.get(icon.src)).status()).toBe(200);
  }
});
