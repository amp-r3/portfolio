'use client';

import { useTheme } from '@/shared/theme';
import { moonIcon, sunIcon } from '@/shared/assets';
import style from './theme-switch.module.scss';

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const handleLabelClick = (mode: 'light' | 'dark') => {
    if (theme !== mode) {
      toggleTheme();
    }
  };

  return (
    <div className={style.wrapper}>
      <span
        className={`${style.label} ${!isLight ? style.active : ''}`}
        onClick={() => handleLabelClick('dark')}
      >
        Dark
      </span>
      <label className={style.switch}>
        <input
          type="checkbox"
          checked={isLight}
          onChange={toggleTheme}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        />
        <span className={style.slider}></span>
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
      <span
        className={`${style.label} ${isLight ? style.active : ''}`}
        onClick={() => handleLabelClick('light')}
      >
        Light
      </span>
    </div>
  );
}
