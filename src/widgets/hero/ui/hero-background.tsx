import style from './hero-background.module.scss';

export function HeroBackground() {
  return (
    <div className={style.backgroundContainer}>
      {/* --- Dark Theme (default for SSR / no JS) --- */}
      <div className={`${style.stack} ${style.stackDark}`} />

      {/* --- Light Theme (crossfaded over the dark stack) --- */}
      <div className={`${style.stack} ${style.stackLight}`} />
    </div>
  );
}
