import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router'; 
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const location = useLocation();
  const scrollRef = useRef<LocomotiveScroll | null>(null);

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

  useLayoutEffect(() => {

    const body = document.body;

    body.style.opacity = '0';
    body.style.pointerEvents = 'none'; 

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.transition = 'opacity 0.3s ease';
        body.style.opacity = '1';
        body.style.pointerEvents = '';

        setTimeout(() => {
          body.style.transition = '';
        }, 300);
      });
    });
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;