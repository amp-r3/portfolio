'use client';

import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { ThemeContext, type Theme } from '@/shared/theme';

let currentTheme: Theme = 'dark';
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'theme') {
      const val = e.newValue;
      if (val === 'light' || val === 'dark') {
        currentTheme = val;
        emitChange();
      }
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getStoredClientTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return 'dark';
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'dark';
}

function setThemeExternal(newTheme: Theme) {
  if (currentTheme === newTheme) return;
  currentTheme = newTheme;
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      window.localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Could not save theme to localStorage', e);
    }
  }
  emitChange();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const stored = getStoredClientTheme();
    if (stored !== currentTheme) {
      setThemeExternal(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    const layers = document.querySelectorAll('.gradientLayer');
    layers.forEach((layer) => layer.classList.add('transitioning'));

    const timer = setTimeout(() => {
      layers.forEach((layer) => layer.classList.remove('transitioning'));
    }, 1500);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeExternal(nextTheme);
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
