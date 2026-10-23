import style from './hero-background.module.scss';

export function HeroBackground() {
  return (
    <div className={style.backgroundContainer}>
      {/* --- Dark Theme Layers --- */}
      <div className={`${style.gradientLayer} ${style.darkBase}`} />
      <div className={`${style.gradientLayer} ${style.darkAccent1}`} />
      <div className={`${style.gradientLayer} ${style.darkAccent2}`} />
      <div className={`${style.gradientLayer} ${style.darkAccent3}`} />
      <div className={`${style.gradientLayer} ${style.darkOverlay}`} />

      {/* --- Light Theme Layers --- */}
      <div className={`${style.gradientLayer} ${style.lightBase}`} />
      <div className={`${style.gradientLayer} ${style.lightAccent1}`} />
      <div className={`${style.gradientLayer} ${style.lightAccent2}`} />
      <div className={`${style.gradientLayer} ${style.lightAccent3}`} />
      <div className={`${style.gradientLayer} ${style.lightOverlay}`} />
    </div>
  );
}
