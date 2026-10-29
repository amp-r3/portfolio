'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/shared/config';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/shared/lib';
import { useImageZoom } from './use-image-zoom';
import { CloseIcon, MinusIcon, PlusIcon, ResetIcon } from './viewer-icons';
import styles from './image-viewer.module.scss';

export interface IImageViewerSlide {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface IImageViewerTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface IImageViewerLabels {
  close: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  tabsLabel: string;
}

export interface IImageViewerProps {
  slides: readonly IImageViewerSlide[];
  tabs: readonly IImageViewerTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onClose: () => void;
  dialogLabel: string;
  labels: IImageViewerLabels;
}

/** Keep in sync with `$transition-duration-fast` in the SCSS module. */
const CLOSE_ANIMATION_MS = 200;

interface IZoomableSlideProps {
  slide: IImageViewerSlide;
  panelId: string;
  labelledBy?: string;
  hasTabs: boolean;
  labels: IImageViewerLabels;
}

/**
 * Keeping the zoom state inside a keyed child means switching Desktop/Mobile
 * remounts the viewport with a clean 1x transform, without a reset effect.
 */
function ZoomableSlide({ slide, panelId, labelledBy, hasTabs, labels }: IZoomableSlideProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    zoom,
    isInteracting,
    isZoomed,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    reset,
    imageStyle,
    imageHandlers,
  } = useImageZoom({ stageRef, imageRef });

  return (
    <>
      <div className={styles.stage}>
        <div
          ref={stageRef}
          id={panelId}
          className={styles.viewport}
          role={hasTabs ? 'tabpanel' : undefined}
          aria-labelledby={labelledBy}
        >
          <Image
            ref={imageRef}
            src={slide.src}
            alt={slide.alt}
            width={slide.width}
            height={slide.height}
            className={[
              styles.image,
              isZoomed ? styles.imageZoomed : '',
              isInteracting ? styles.imageDragging : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={imageStyle}
            loading="eager"
            fetchPriority="high"
            unoptimized
            draggable={false}
            {...imageHandlers}
          />
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label={labels.zoomOut}
        >
          <MinusIcon />
        </button>

        <output className={styles.zoomValue}>{Math.round(zoom * 100)}%</output>

        <button
          type="button"
          className={styles.controlButton}
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label={labels.zoomIn}
        >
          <PlusIcon />
        </button>

        <button
          type="button"
          className={styles.controlButton}
          onClick={reset}
          disabled={!canZoomOut}
          aria-label={labels.resetZoom}
        >
          <ResetIcon />
        </button>
      </div>
    </>
  );
}

export function ImageViewer({
  slides,
  tabs,
  activeTabId,
  onTabChange,
  onClose,
  dialogLabel,
  labels,
}: IImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabsId = useId();
  const panelId = `${tabsId}-panel`;
  const reducedMotion = usePrefersReducedMotion();
  const [isClosing, setIsClosing] = useState(false);

  const activeSlide = slides.find((slide) => slide.id === activeTabId) ?? slides[0];
  const hasSlides = slides.length > 0;
  const hasTabs = tabs.length > 1;

  const requestClose = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;

    if (reducedMotion) {
      onClose();
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  }, [onClose, reducedMotion]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !hasSlides) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const scrollY = window.scrollY;
    const body = document.body;
    const initialClientWidth = document.documentElement.clientWidth;
    const previousStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
      paddingRight: body.style.paddingRight,
    };

    pauseSmoothScroll();

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflowY = 'hidden';

    // scrollbar-gutter: stable already reserves the space; compensate only real loss.
    const lockedClientWidth = document.documentElement.clientWidth;
    const lostWidth = Math.max(0, lockedClientWidth - initialClientWidth);
    body.style.paddingRight = lostWidth > 0 ? `${lostWidth}px` : '';

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog.setAttribute('open', '');
    }

    return () => {
      if (typeof dialog.close === 'function' && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }

      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      body.style.overflowY = previousStyles.overflowY;
      body.style.paddingRight = previousStyles.paddingRight;

      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
      resumeSmoothScroll(scrollY);

      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [hasSlides]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      requestClose();
    }
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    onTabChange(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  if (!activeSlide) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      data-closing={isClosing ? 'true' : undefined}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.backdrop} onClick={requestClose} aria-hidden="true" />

      <div className={styles.topBar}>
        {hasTabs ? (
          <div className={styles.tabs} role="tablist" aria-label={labels.tabsLabel}>
            {tabs.map((tab, index) => {
              const selected = tab.id === activeSlide.id;

              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${tabsId}-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  className={styles.tab}
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {tab.icon && (
                    <span className={styles.tabIcon} aria-hidden="true">
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}

        <button
          type="button"
          className={styles.close}
          onClick={requestClose}
          aria-label={labels.close}
        >
          <CloseIcon />
        </button>
      </div>

      <ZoomableSlide
        key={`${activeSlide.id}:${activeSlide.src}`}
        slide={activeSlide}
        panelId={panelId}
        labelledBy={hasTabs ? `${tabsId}-${activeSlide.id}` : undefined}
        hasTabs={hasTabs}
        labels={labels}
      />
    </dialog>
  );
}
