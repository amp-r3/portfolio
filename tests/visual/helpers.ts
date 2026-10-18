import { expect, type Page, type TestInfo } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';

export const languages = ['en', 'ru', 'uz'] as const;
export const themes = ['light', 'dark'] as const;
export const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
export type Language = typeof languages[number];
export type Theme = typeof themes[number];

export async function openPage(page: Page, path: string, language: Language = 'en', theme: Theme = 'dark', staticFrame = true) {
  await page.clock.setFixedTime(new Date('2026-10-18T07:00:00.000Z'));
  await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
  const candidate = process.env.VISUAL_TARGET === 'candidate';
  await page.goto(candidate ? `/${language}${path === '/' ? '' : path}` : path);
  const switcher = page.getByRole('button', { name: 'Change language' });
  await expect(switcher).toHaveText(candidate ? language.toUpperCase() : 'EN');
  if (!candidate) {
    for (let index = 0; index < languages.indexOf(language); index++) {
      await switcher.click();
      await expect(switcher).toHaveText(languages[index + 1].toUpperCase());
    }
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => undefined)));
  });
  await page.waitForTimeout(2300);
  if (staticFrame) await freezeLoops(page);
}

export async function freezeLoops(page: Page) {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations === Infinity) {
        animation.pause();
        animation.currentTime = 0;
      }
    }
  });
}

export async function scrollToSection(page: Page, selector: string) {
  const top = await page.locator(selector).evaluate((element) => {
    const top = Math.min(element.getBoundingClientRect().top + window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'instant' });
    return top;
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(top, 0);
  await page.waitForTimeout(2300);
  await freezeLoops(page);
}

export async function screenshot(page: Page, testInfo: TestInfo, name: string, fullPage = false) {
  await freezeLoops(page);
  const actual = await page.screenshot({ fullPage, animations: 'disabled', caret: 'hide' });
  if (process.env.BASELINE_CAPTURE === '1') {
    if (process.env.VISUAL_TARGET === 'candidate') throw new Error('Cannot capture a candidate as a baseline.');
    const target = resolve('tests/visual/baseline', name);
    await mkdir(resolve('tests/visual/baseline'), { recursive: true });
    // Exclusive creation: even explicit capture never overwrites a recorded frame.
    await writeFile(target, actual, { flag: 'wx' });
    return;
  }
  try {
    expect(actual).toMatchSnapshot(name);
  } catch (error) {
    const expected = await readFile(resolve('tests/visual/baseline', name)).catch(() => undefined);
    if (expected) {
      const a = PNG.sync.read(expected);
      const b = PNG.sync.read(actual);
      const overlay = new PNG({ width: Math.max(a.width, b.width), height: Math.max(a.height, b.height) });
      for (let y = 0; y < overlay.height; y++) {
        for (let x = 0; x < overlay.width; x++) {
          const offset = (y * overlay.width + x) * 4;
          for (let channel = 0; channel < 3; channel++) {
            const first = x < a.width && y < a.height ? a.data[(y * a.width + x) * 4 + channel] : 255;
            const second = x < b.width && y < b.height ? b.data[(y * b.width + x) * 4 + channel] : 255;
            overlay.data[offset + channel] = Math.round((first + second) / 2);
          }
          overlay.data[offset + 3] = 255;
        }
      }
      await testInfo.attach('overlay', { body: PNG.sync.write(overlay), contentType: 'image/png' });
    }
    throw error;
  }
}

// The original menu button has no accessible name. Avoid CSS Modules hashes.
export const menuButton = (page: Page) => page.locator('button').filter({ has: page.locator('svg line') });
