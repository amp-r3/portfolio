import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  pauseSmoothScroll,
  registerSmoothScroll,
  resumeSmoothScroll,
  scrollToElement,
  scrollToSection,
  scrollToTop,
  type SmoothScrollHandle,
} from '@/shared/lib';

function createHandle(): SmoothScrollHandle {
  return {
    scrollTo: vi.fn(),
    stop: vi.fn(),
    start: vi.fn(),
    resize: vi.fn(),
  };
}

function mockReducedMotion(matches: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: matches && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function mockScrollMargin(value: string): void {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    scrollMarginTop: value,
  } as CSSStyleDeclaration);
}

function createSection(id?: string): HTMLElement {
  const element = document.createElement('section');

  if (id) {
    element.id = id;
  }

  element.scrollIntoView = vi.fn();
  document.body.append(element);

  return element;
}

describe('smooth scroll helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    registerSmoothScroll(null);
    vi.restoreAllMocks();
  });

  describe('scrollToElement', () => {
    it('falls back to native smooth scrolling without a Lenis instance', () => {
      const element = createSection();

      scrollToElement(element);

      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('respects reduced motion and avoids Lenis', () => {
      mockReducedMotion(true);

      const handle = createHandle();
      registerSmoothScroll(handle);
      const element = createSection();

      scrollToElement(element);

      expect(handle.scrollTo).not.toHaveBeenCalled();
      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
    });

    it('uses the CSS scroll-margin as a Lenis offset', () => {
      mockScrollMargin('86px');

      const handle = createHandle();
      registerSmoothScroll(handle);
      const element = createSection();

      scrollToElement(element);

      expect(handle.scrollTo).toHaveBeenCalledWith(element, {
        offset: -86,
        duration: 1.2,
        easing: expect.any(Function),
      });
    });

    it('falls back to the measured header height without scroll-margin', () => {
      mockScrollMargin('');

      const header = document.createElement('header');
      header.dataset.header = '';
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ height: 72 } as DOMRect);
      document.body.append(header);

      const handle = createHandle();
      registerSmoothScroll(handle);
      const element = createSection();

      scrollToElement(element);

      expect(handle.scrollTo).toHaveBeenCalledWith(element, {
        offset: -72,
        duration: 1.2,
        easing: expect.any(Function),
      });
    });
  });

  describe('scrollToSection', () => {
    it('scrolls to an existing section', () => {
      mockScrollMargin('80px');

      const handle = createHandle();
      registerSmoothScroll(handle);
      const element = createSection('projects');

      scrollToSection('projects');

      expect(handle.scrollTo).toHaveBeenCalledWith(element, {
        offset: -80,
        duration: 1.2,
        easing: expect.any(Function),
      });
    });

    it('ignores unknown or empty ids', () => {
      const handle = createHandle();
      registerSmoothScroll(handle);

      scrollToSection('missing');
      scrollToSection('');

      expect(handle.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    it('uses Lenis with immediate option', () => {
      const handle = createHandle();
      registerSmoothScroll(handle);

      scrollToTop(true);

      expect(handle.scrollTo).toHaveBeenCalledWith(0, {
        immediate: true,
        duration: undefined,
        easing: undefined,
      });
    });

    it('animates to the top with the shared duration', () => {
      const handle = createHandle();
      registerSmoothScroll(handle);

      scrollToTop();

      expect(handle.scrollTo).toHaveBeenCalledWith(0, {
        immediate: false,
        duration: 1.2,
        easing: expect.any(Function),
      });
    });

    it('falls back to window.scrollTo', () => {
      const scrollSpy = vi.spyOn(window, 'scrollTo');

      scrollToTop(true);
      scrollToTop();

      expect(scrollSpy).toHaveBeenNthCalledWith(1, { top: 0, behavior: 'auto' });
      expect(scrollSpy).toHaveBeenNthCalledWith(2, { top: 0, behavior: 'smooth' });
    });
  });

  describe('pause and resume', () => {
    it('stops and restarts the registered instance', () => {
      const handle = createHandle();
      registerSmoothScroll(handle);

      pauseSmoothScroll();
      resumeSmoothScroll(120);

      expect(handle.stop).toHaveBeenCalledOnce();
      expect(handle.start).toHaveBeenCalledOnce();
      expect(handle.resize).toHaveBeenCalledOnce();
      expect(handle.scrollTo).toHaveBeenCalledWith(120, { immediate: true });
    });

    it('does nothing without a registered instance', () => {
      expect(() => {
        pauseSmoothScroll();
        resumeSmoothScroll(120);
        resumeSmoothScroll();
      }).not.toThrow();
    });
  });
});
