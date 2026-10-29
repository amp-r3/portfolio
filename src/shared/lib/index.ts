export {
  pauseSmoothScroll,
  registerSmoothScroll,
  resumeSmoothScroll,
  scrollToElement,
  scrollToSection,
  scrollToTop,
} from './scroll';
export type { SmoothScrollHandle, SmoothScrollOptions } from './scroll';

export {
  DEFAULT_THEME,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  ThemeContext,
  parseTheme,
  useTheme,
} from './theme';
export type { Theme, ThemeContextProps } from './theme';
