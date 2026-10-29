'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/lib';
import style from './theme-switch.module.scss';

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={style.wrapper}>
      <label className={style.switch} title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}>
        <input
          type="checkbox"
          checked={isLight}
          onChange={toggleTheme}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        />
        <span className={style.slider} />
        <Sun
          role="img"
          aria-label="Sun"
          className={`${style.icon} ${style.sunIcon}`}
        />
        <Moon
          role="img"
          aria-label="Moon"
          className={`${style.icon} ${style.moonIcon}`}
        />
      </label>
    </div>
  );
}
