'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  containerStaggerVariants,
  socialsData,
  textRevealVariants,
  usePrefersReducedMotion,
} from '@/shared/config';
import style from './hero-section.module.scss';
import { HeroBackground } from './hero-background';

const contactsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export function HeroSection() {
  const t = useTranslations();
  const targetRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, (value) => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const progress = Math.min(Math.max(value / h, 0), 1);
    return 1 - progress * 0.25;
  });

  const y = useTransform(scrollY, (value) => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const progress = Math.min(Math.max(value / h, 0), 1);
    return `${progress * 35}%`;
  });

  const opacity = useTransform(scrollY, (value) => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const progress = Math.min(Math.max(value / h, 0), 1);
    if (progress <= 0.25) return 1;
    if (progress >= 0.85) return 0;
    return 1 - (progress - 0.25) / (0.85 - 0.25);
  });

  const scrollStyle = prefersReduced ? undefined : { scale, opacity, y };

  return (
    <section ref={targetRef} id="hero" className={style.hero}>
      <motion.div
        className={`${style.hero__content} container`}
        variants={containerStaggerVariants}
        initial="hidden"
        animate="visible"
        style={scrollStyle}
      >
        <motion.div variants={containerStaggerVariants} className={style.hero__center}>
          <motion.p variants={textRevealVariants} className={style.hero__greeting}>
            {t('hero.greeting')}
          </motion.p>

          <motion.h1 variants={textRevealVariants} className={style.hero__title}>
            <span className={style.hero__titlePrimary}>{t('hero.titleRole')}</span>
            {' '}
            <span className={style.hero__titleSecondary}>{t('hero.titleTagline')}</span>
          </motion.h1>

          <motion.p variants={textRevealVariants} className={style.hero__desc}>
            {t('hero.description')}
          </motion.p>

          <motion.div variants={textRevealVariants} className={style.hero__actions}>
            <a href="#projects" className={style.hero__primaryBtn}>
              {t('hero.primaryButton')}
            </a>
            <a href="#contact" className={style.hero__secondaryBtn}>
              {t('hero.secondaryButton')}
            </a>
          </motion.div>
        </motion.div>

        <div className={style.hero__bottom}>
          <motion.div
            variants={contactsContainerVariants}
            initial="hidden"
            animate="visible"
            className={style.hero__contacts}
          >
            <motion.a
              variants={textRevealVariants}
              href={socialsData.telegram.link}
              target="_blank"
              rel="noreferrer"
              className={style.hero__links}
            >
              <img src={socialsData.telegram.icon} alt="Telegram" />
            </motion.a>
            <motion.a
              variants={textRevealVariants}
              href={socialsData.github.link}
              target="_blank"
              rel="noreferrer"
              className={style.hero__links}
            >
              <img src={socialsData.github.icon} alt="GitHub" />
            </motion.a>
            <motion.a
              variants={textRevealVariants}
              href={socialsData.linkedin.link}
              target="_blank"
              rel="noreferrer"
              className={style.hero__links}
            >
              <img src={socialsData.linkedin.icon} alt="LinkedIn" />
            </motion.a>
            <motion.a
              variants={textRevealVariants}
              href={`mailto:${socialsData.email.link}`}
              className={style.hero__links}
            >
              <img src={socialsData.email.icon} alt="Email" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <HeroBackground />
    </section>
  );
}
