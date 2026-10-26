import type { Theme } from './types';

export const DEFAULT_THEME: Theme = 'dark';
export const THEME_STORAGE_KEY = 'theme';
export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseTheme(value: string | null | undefined): Theme {
  return value === 'light' || value === 'dark' ? value : DEFAULT_THEME;
}
