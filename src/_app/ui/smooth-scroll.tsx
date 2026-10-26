'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type Lenis from 'lenis';
import { usePathname } from '@/shared/i18n';
import { usePrefersReducedMotion } from '@/shared/config';
import { registerSmoothScroll, scrollToSection, scrollToTop } from '@/shared/lib';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: ReactNode;
}

const LENIS_OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: true,
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();
  const previousPathname = useRef<string>(pathname);

  useEffect(() => {
    if (prefersReduced) {
      return;
    }

    let cancelled = false;
    let instance: Lenis | null = null;

    void (async () => {
      const { default: LenisConstructor } = await import('lenis');

      if (cancelled) {
        return;
      }

      instance = new LenisConstructor(LENIS_OPTIONS);
      registerSmoothScroll(instance);
    })();

    return () => {
      cancelled = true;
      registerSmoothScroll(null);
      instance?.destroy();
      instance = null;
    };
  }, [prefersReduced]);

  // Один обработчик на все внутренние якоря: hero, header, footer, legacy #skills.
  // Header перехватывает свои ссылки сам (defaultPrevented), остальные попадают сюда.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.target === '_blank') {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      const id = decodeURIComponent(href.slice(1));

      if (!id) {
        event.preventDefault();
        scrollToTop();
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
        return;
      }

      if (!document.getElementById(id)) {
        return;
      }

      event.preventDefault();
      scrollToSection(id);
      window.history.pushState(null, '', href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Скролл наверх при смене маршрута. Hash сохраняем, если цель есть на новой странице.
  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    requestAnimationFrame(() => {
      const hash = decodeURIComponent(window.location.hash.slice(1));

      if (hash && document.getElementById(hash)) {
        scrollToSection(hash);
        return;
      }

      scrollToTop(true);
    });
  }, [pathname]);

  // Прямой переход по ссылке с hash: учитываем offset шапки, а не позицию браузера.
  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));
    const frame = requestAnimationFrame(() => scrollToSection(hash));

    return () => cancelAnimationFrame(frame);
  }, []);

  return <>{children}</>;
}
