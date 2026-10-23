'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  containerStaggerVariants,
  socialsData,
  textRevealVariants,
  transitionSmooth,
} from '@/shared/config';
import style from './footer.module.scss';
import { FooterBackground } from './footer-background';

const basementContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const socialsStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const rightsRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 0.7,
    y: 0,
    transition: transitionSmooth,
  },
};

export function Footer() {
  const t = useTranslations();

  return (
    <footer className={style.footer}>
      {/* Main content (CTA) */}
      <motion.div
        className={`${style.footer__content} container`}
        variants={containerStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
      >
        <motion.h1 variants={textRevealVariants} className={style.footer__title}>
          {t('footer.title')}
        </motion.h1>
        <motion.p variants={textRevealVariants} className={style.footer__desc}>
          {t('footer.description')}
        </motion.p>
        <motion.a href="#contact" className={style.footer__btn} variants={textRevealVariants}>
          {t('footer.button')}
        </motion.a>
      </motion.div>

      {/* Contacts */}
      <motion.div
        className={`${style.footer__basement} container`}
        variants={basementContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: '0px 0px -20px 0px' }}
      >
        <motion.a variants={textRevealVariants} href="#" className={style.footer__logo}>
          amp-r3
        </motion.a>

        <div className={style.footer__contacts}>
          <motion.a
            variants={textRevealVariants}
            href={`mailto:${socialsData.email.link}`}
            className={style.footer__email}
          >
            {socialsData.email.link}
          </motion.a>

          <motion.div variants={socialsStaggerVariants} className={style.footer__socials}>
            <motion.a
              variants={textRevealVariants}
              href={socialsData.telegram.link}
              target="_blank"
              rel="noreferrer"
              className={style.footer__links}
            >
              <img src={socialsData.telegram.icon} alt="Telegram" />
            </motion.a>
            <motion.a
              variants={textRevealVariants}
              href={socialsData.github.link}
              target="_blank"
              rel="noreferrer"
              className={style.footer__links}
            >
              <img src={socialsData.github.icon} alt="GitHub" />
            </motion.a>
            <motion.a
              variants={textRevealVariants}
              href={socialsData.linkedin.link}
              target="_blank"
              rel="noreferrer"
              className={style.footer__links}
            >
              <img src={socialsData.linkedin.icon} alt="LinkedIn" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.span
        className={style.footer__rights}
        variants={rightsRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        © {new Date().getFullYear()} {t('footer.rights')}
      </motion.span>
      <FooterBackground />
    </footer>
  );
}
