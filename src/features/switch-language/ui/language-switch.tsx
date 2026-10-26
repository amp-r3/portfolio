'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from 'next-intl';
import { routing, useI18n, usePathname, useRouter } from '@/shared/i18n';
import style from './language-switch.module.scss';

export function LanguageSwitch() {
  const intlLocale = useLocale();
  const i18n = useI18n();
  const locale = i18n?.locale ?? intlLocale;
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = routing.locales.includes(locale as (typeof routing.locales)[number]) ? locale : 'en';

  const changeLanguage = () => {
    const currentIndex = routing.locales.indexOf(currentLang as (typeof routing.locales)[number]);
    const nextIndex = (currentIndex + 1) % routing.locales.length;
    const newLang = routing.locales[nextIndex];
    // Hash не переносим: иначе после смены локали якорь сработает повторно.
    const query = window.location.search;

    const is404 = i18n?.isNotFound || (typeof document !== 'undefined' && Boolean(document.querySelector('[data-text="404"]')));

    if (is404) {
      i18n?.setLocale(newLang);
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/');
      if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
        segments[1] = newLang;
      } else {
        segments.splice(1, 0, newLang);
      }
      const newPath = segments.join('/') + query;
      window.history.replaceState(null, '', newPath);
      return;
    }

    router.replace(`${pathname}${query}`, { locale: newLang, scroll: false });
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
