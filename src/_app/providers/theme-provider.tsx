'use client';

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { ThemeContext, type Theme } from '@/shared/theme';

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

let currentTheme: Theme = typeof window !== 'undefined' ? getStoredClientTheme() : 'dark';
const listeners = new Set<() => void>();

if (typeof window !== 'undefined' && typeof Element !== 'undefined' && !(window as unknown as { __themeGuarded?: boolean }).__themeGuarded) {
  (window as unknown as { __themeGuarded?: boolean }).__themeGuarded = true;
  const origSet = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    const res = origSet.call(this, name, value);
    if (this === document.documentElement && (name === 'lang' || name === 'class')) {
      const saved = currentTheme;
      if (this.getAttribute('data-theme') !== saved) {
        origSet.call(this, 'data-theme', saved);
      }
    }
    return res;
  };
  const origRem = Element.prototype.removeAttribute;
  Element.prototype.removeAttribute = function(name) {
    if (this === document.documentElement && name === 'data-theme') return;
    return origRem.call(this, name);
  };
}

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
  const isMountedRef = useRef(false);
  const prevThemeRef = useRef<Theme>(currentTheme);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      const currentAttr = document.documentElement.getAttribute('data-theme');
      if (currentAttr !== currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
      return;
    }

    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      document.documentElement.setAttribute('data-theme', theme);

      const layers = document.querySelectorAll('.gradientLayer');
      layers.forEach((layer) => layer.classList.add('transitioning'));

      const timer = setTimeout(() => {
        layers.forEach((layer) => layer.classList.remove('transitioning'));
      }, 1500);

      return () => clearTimeout(timer);
    }
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
