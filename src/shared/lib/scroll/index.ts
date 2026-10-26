export interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  force?: boolean;
}

/**
 * Minimal contract shared with the smooth-scroll provider.
 * Keeps `_app` as the only layer that knows about the Lenis instance.
 */
export interface SmoothScrollHandle {
  scrollTo(target: number | string | HTMLElement, options?: SmoothScrollOptions): void;
  stop(): void;
  start(): void;
  resize(): void;
}

const DEFAULT_ANCHOR_DURATION = 1.2;
const FALLBACK_HEADER_HEIGHT = 97;

// Мягкий старт и финиш вместо резкого easeOutExpo у Lenis по умолчанию.
const ANCHOR_EASING = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let handle: SmoothScrollHandle | null = null;

export function registerSmoothScroll(next: SmoothScrollHandle | null): void {
  handle = next;
}

export function pauseSmoothScroll(): void {
  handle?.stop();
}

export function resumeSmoothScroll(target?: number): void {
  if (!handle) {
    return;
  }

  handle.start();
  // Пока меню открыто, body fixed обнуляет высоту документа — пересчитываем limit.
  handle.resize();

  if (typeof target === 'number') {
    handle.scrollTo(target, { immediate: true });
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getHeaderOffset(): number {
  if (typeof document === 'undefined') {
    return -FALLBACK_HEADER_HEIGHT;
  }

  const header = document.querySelector<HTMLElement>('[data-header]');
  return header ? -header.getBoundingClientRect().height : -FALLBACK_HEADER_HEIGHT;
}

/**
 * Anchor offset lives in CSS (`scroll-margin-top`), so native fallback and
 * Lenis share the same value. Elements without it fall back to the header size.
 */
function resolveOffset(element: HTMLElement): number {
  const scrollMargin = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop);

  if (Number.isFinite(scrollMargin) && scrollMargin > 0) {
    return -scrollMargin;
  }

  return getHeaderOffset();
}

export function scrollToElement(element: HTMLElement): void {
  const reduced = prefersReducedMotion();

  if (handle && !reduced) {
    // Пересчёт перед каждым якорем: секции могли изменить высоту после меню/аккордеона.
    handle.resize();
    handle.scrollTo(element, {
      offset: resolveOffset(element),
      duration: DEFAULT_ANCHOR_DURATION,
      easing: ANCHOR_EASING,
    });
    return;
  }

  element.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  });
}

export function scrollToSection(id: string): void {
  if (typeof document === 'undefined' || !id) {
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    scrollToElement(element);
  }
}

export function scrollToTop(immediate = false): void {
  const reduced = prefersReducedMotion();

  if (handle && !reduced) {
    handle.scrollTo(0, {
      immediate,
      duration: immediate ? undefined : DEFAULT_ANCHOR_DURATION,
      easing: immediate ? undefined : ANCHOR_EASING,
    });
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: immediate || reduced ? 'auto' : 'smooth',
  });
}
