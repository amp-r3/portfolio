import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
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



  return <>{children}</>;
};

export default SmoothScroll;