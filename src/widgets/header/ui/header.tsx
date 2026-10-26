'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname, usePathname, useRouter } from '@/shared/i18n';
import { LanguageSwitch } from '@/features/switch-language';
import { ThemeSwitch } from '@/features/switch-theme';
import { pauseSmoothScroll, resumeSmoothScroll, scrollToSection } from '@/shared/lib';
import style from './header.module.scss';
import { MenuButton } from './menu-button';
import { useHeaderScroll } from '../model/use-header-scroll';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pendingTargetRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const isHome = pathname === '/';
  useHeaderScroll(navRef, pathname);
  const t = useTranslations();

  const scrollToTarget = useCallback((targetId: string) => {
    scrollToSection(targetId);
    window.history.pushState(null, '', `#${targetId}`);
  }, []);

  const navigateToTarget = useCallback(
    (targetId: string) => {
      if (isHome) {
        scrollToTarget(targetId);
        return;
      }

      router.push(`/#${targetId}`);
    },
    [isHome, router, scrollToTarget]
  );

  const getHref = (targetId: string) =>
    isHome ? `#${targetId}` : getPathname({ href: `/#${targetId}`, locale });

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollYStart = window.scrollY;
    const initialClientWidth = document.documentElement.clientWidth;

    pauseSmoothScroll();

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYStart}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'hidden';

    // scrollbar-gutter: stable уже резервирует место; компенсируем только реальную потерю.
    const lockedClientWidth = document.documentElement.clientWidth;
    const lostWidth = Math.max(0, lockedClientWidth - initialClientWidth);
    document.body.style.paddingRight = lostWidth > 0 ? `${lostWidth}px` : '';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      document.body.style.overflowY = '';

      window.scrollTo({
        top: scrollYStart,
        left: 0,
        behavior: 'instant',
      });

      resumeSmoothScroll(scrollYStart);

      // Lenis возобновляем до перехода: пока меню открыто, scrollTo игнорируется.
      // rAF нужен, чтобы scrollTo не перебил нативный scroll-event после снятия lock.
      const targetId = pendingTargetRef.current;

      if (targetId) {
        pendingTargetRef.current = null;
        requestAnimationFrame(() => navigateToTarget(targetId));
      }
    };
  }, [isMenuOpen, navigateToTarget]);

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();

    if (!isMenuOpen) {
      navigateToTarget(targetId);
      return;
    }

    pendingTargetRef.current = targetId;
    setIsMenuOpen(false);
  };

  return (
    <div ref={navRef} className={style.header} data-header>
      <div className={style.header__wrapper + ' container'}>
        <a href="#" className={style.header__logo}>
          amp-r3
        </a>
        <MenuButton isOpen={isMenuOpen} onClick={handleMenu} className={style.header__menu_btn} />
        <ul className={`${style.header__menu} ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a
              onClick={(e) => {
                onLinkClick(e, 'services');
              }}
              href={getHref('services')}
              className={style.header__link}
            >
              {t('header.nav.services')}
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                onLinkClick(e, 'projects');
              }}
              href={getHref('projects')}
              className={style.header__link}
            >
              {t('header.nav.projects')}
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                onLinkClick(e, 'contact');
              }}
              href={getHref('contact')}
              className={style.header__link}
            >
              {t('header.nav.contact')}
            </a>
          </li>
        </ul>
        <div className={`${style.header__option} ${isMenuOpen ? 'active' : ''}`}>
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
