'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '@/shared/i18n';
import style from './language-switch.module.scss';

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = routing.locales.includes(locale as (typeof routing.locales)[number]) ? locale : 'en';

  const changeLanguage = () => {
    const currentIndex = routing.locales.indexOf(currentLang as (typeof routing.locales)[number]);
    const nextIndex = (currentIndex + 1) % routing.locales.length;
    const newLang = routing.locales[nextIndex];
    const suffix = `${window.location.search}${window.location.hash}`;

    router.replace(`${pathname}${suffix}`, { locale: newLang, scroll: false });
  };

  const variants = {
    initial: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      rotateX: -90,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      rotateX: 90,
      filter: 'blur(4px)',
    },
  };

  return (
    <button onClick={changeLanguage} className={style.Btn} aria-label="Change language">
      <div className={style.contentContainer}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentLang}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.12,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className={style.langText}
          >
            {currentLang.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
}
