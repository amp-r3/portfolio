import { useSyncExternalStore } from 'react';
import type { Transition, Variants } from 'motion/react';

export const MOTION_EASING = [0.22, 1, 0.36, 1] as const;
export const MOTION_DURATION = 0.8;

export const transitionSmooth: Transition = {
  duration: MOTION_DURATION,
  ease: MOTION_EASING,
};

export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitionSmooth,
  },
};

export const containerStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const emptySubscribe = () => () => {};

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
}

function getSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    typeof window !== 'undefined' ? subscribe : emptySubscribe,
    getSnapshot,
    getServerSnapshot,
  );
}

