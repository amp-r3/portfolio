'use client';

import { useTheme } from '@/shared/theme';
import { moonIcon, sunIcon } from '@/shared/assets';
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
        <img
          src={sunIcon}
          alt="Sun"
          className={`${style.icon} ${style.sunIcon}`}
        />
        <img
          src={moonIcon}
          alt="Moon"
          className={`${style.icon} ${style.moonIcon}`}
        />
      </label>
    </div>
  );
}
