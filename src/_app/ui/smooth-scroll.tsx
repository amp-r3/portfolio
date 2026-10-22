'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type LocomotiveScroll from 'locomotive-scroll';
import { usePathname } from '@/shared/i18n';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: ReactNode;
}

let previousPathname: string | undefined;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    let cancelled = false;

    void (async () => {
      const { default: LocomotiveScrollConstructor } = await import('locomotive-scroll');

      if (cancelled) return;

      scrollRef.current = new LocomotiveScrollConstructor({
        lenisOptions: {
          lerp: 0.1,
          duration: 1.5,
          syncTouch: false,
          smoothWheel: true,
          wheelMultiplier: 1,
        },
      });
    })();

    return () => {
      cancelled = true;
      scrollRef.current?.destroy();
      scrollRef.current = null;
    };
  }, []);

  // Скролл наверх при изменении маршрута
  useEffect(() => {
    if (previousPathname !== undefined && previousPathname !== pathname) {
      if (scrollRef.current) {
        // Для Locomotive Scroll используем scrollTo
        scrollRef.current.scrollTo(0, {
          duration: 1, // Мгновенный переход
        });
      } else {
        // Fallback для мобильных устройств
        window.scrollTo(0, 0);
      }
    }

    previousPathname = pathname;
  }, [pathname]);

  return <>{children}</>;
}
