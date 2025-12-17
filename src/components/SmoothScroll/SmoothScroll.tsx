import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const scrollRef = useRef<LocomotiveScroll | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.1,
        duration: 1.5,
        syncTouch: false,
        smoothWheel: true,
        wheelMultiplier: 1,
      },
    });

    scrollRef.current = locomotiveScroll;

    return () => {
      locomotiveScroll.destroy();
      scrollRef.current = null;
    };
  }, []);

  // Скролл наверх при изменении маршрута
  useEffect(() => {
    if (scrollRef.current) {
      // Для Locomotive Scroll используем scrollTo
      scrollRef.current.scrollTo(0, {
        duration: 1, // Мгновенный переход
      });
    } else {
      // Fallback для мобильных устройств
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;