import style from './footer-background.module.scss';

export function FooterBackground() {
  return (
    <div className={style.backgroundContainer}>
      {/* Dark theme layers */}
      <div className={`${style.gradientLayer} ${style.darkBase}`} />
      <div className={`${style.gradientLayer} ${style.darkAccent}`} />

      {/* Light theme layers */}
      <div className={`${style.gradientLayer} ${style.lightBase}`} />
      <div className={`${style.gradientLayer} ${style.lightAccent}`} />
    </div>
  );
}
