import { test, expect } from '@playwright/test';
import { languages, themes, viewports, openPage, screenshot, scrollToSection, menuButton } from './helpers';

const routes = [
  ['home', '/'],
  ['weather', '/project/weather'],
  ['store', '/project/store'],
  ['unknown-project', '/project/unknown'],
  ['unknown-url', '/unknown'],
] as const;

for (const viewport of viewports) {
  for (const language of languages) {
    for (const theme of themes) {
      for (const [name, path] of routes) {
        test(`${name} ${language} ${theme} ${viewport.width}`, async ({ page }, testInfo) => {
          await page.setViewportSize(viewport);
          await openPage(page, path, language, theme);
          const prefix = `${name}-${language}-${theme}-${viewport.width}`;
          await screenshot(page, testInfo, `${prefix}.png`, name !== 'home');
          if (name === 'home') {
            for (const section of ['skills', 'projects', 'contact']) {
              await scrollToSection(page, `#${section}`);
              await screenshot(page, testInfo, `${prefix}-${section}.png`);
            }
            await scrollToSection(page, 'footer');
            await screenshot(page, testInfo, `${prefix}-footer.png`);
          }
        });
      }
    }
  }
}

for (const width of [379, 380, 381, 399, 400, 401, 575, 576, 577, 639, 640, 641, 767, 768, 769, 991, 992, 993, 1023, 1024, 1025]) {
  test(`breakpoint ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page, '/', 'ru', 'dark');
    await screenshot(page, testInfo, `breakpoint-${width}-home.png`);
    await scrollToSection(page, '#projects');
    await screenshot(page, testInfo, `breakpoint-${width}-projects.png`);
    await openPage(page, '/project/store', 'ru', 'light');
    await screenshot(page, testInfo, `breakpoint-${width}-store.png`, true);
  });
}

for (const theme of themes) {
  test(`interactive ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, '/', 'en', theme);
    const projects = page.locator('a[href="#projects"]').last();
    await projects.hover();
    await screenshot(page, testInfo, `interactive-${theme}-hover.png`);
    await page.mouse.move(1439, 899);
    await page.keyboard.press('Tab');
    await screenshot(page, testInfo, `interactive-${theme}-focus.png`);
    await scrollToSection(page, '#projects');
    await expect(page.locator('.scrolled')).toHaveCount(1);
    await screenshot(page, testInfo, `interactive-${theme}-scrolled.png`);
    await page.setViewportSize({ width: 375, height: 812 });
    await openPage(page, '/', 'ru', theme);
    await menuButton(page).click();
    await expect(page.locator('body')).toHaveCSS('position', 'fixed');
    await page.waitForTimeout(1000);
    await screenshot(page, testInfo, `interactive-${theme}-menu.png`);
    await menuButton(page).click();
    await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  });
}
