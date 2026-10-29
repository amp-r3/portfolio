'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  DEFAULT_THEME,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  ThemeContext,
  parseTheme,
  type Theme,
} from '@/shared/lib';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function readDomTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  return parseTheme(document.documentElement.getAttribute('data-theme'));
}

function readPersistedTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage can be unavailable in private browsing or sandboxed frames.
  }

  if (typeof document !== 'undefined') {
    const cookiePattern = new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=(light|dark)(?:;|$)`);
    const match = document.cookie.match(cookiePattern);
    if (match) return parseTheme(match[1]);
  }

  return null;
}

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement;

  if (root.getAttribute('data-theme') !== theme) {
    root.setAttribute('data-theme', theme);
  }

  if (root.style.colorScheme !== theme) {
    root.style.colorScheme = theme;
  }
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Could not save theme to localStorage', error);
  }

  document.cookie = `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function setThemeExternal(theme: Theme) {
  applyThemeToDom(theme);
  persistTheme(theme);
  emitChange();
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);

  const observer = new MutationObserver(() => {
    listener();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;

    const nextTheme = parseTheme(event.newValue);
    applyThemeToDom(nextTheme);
    listener();
  };

  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): Theme {
  return readDomTheme();
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const persistedTheme = readPersistedTheme();
    const attributeTheme = root.getAttribute('data-theme');

    // The inline ThemeScript usually gets here first. This also restores the
    // saved theme during locale navigation, when React replaces <html> and
    // drops the attribute it did not render itself.
    const nextTheme =
      persistedTheme ?? (attributeTheme ? parseTheme(attributeTheme) : DEFAULT_THEME);

    if (root.getAttribute('data-theme') !== nextTheme) {
      applyThemeToDom(nextTheme);
      emitChange();
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Enable the long theme transitions only after hydration. Until then the
    // global transition suppression in base.scss keeps the first paint still.
    root.classList.add('theme-ready');

    return () => {
      root.classList.remove('theme-ready');
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeExternal(readDomTheme() === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
