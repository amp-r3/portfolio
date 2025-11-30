import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    if (window.innerWidth > 768) {
      const locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.1,
          duration: 1.5,
          syncTouch: false,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        },
      });
      return () => {
        locomotiveScroll.destroy();
      };
    }

  }, []);

  return <>{children}</>;
};

export default SmoothScroll;