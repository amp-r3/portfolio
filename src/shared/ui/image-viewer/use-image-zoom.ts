'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { usePrefersReducedMotion } from '@/shared/config';
import {
  clampOffset,
  clampZoom,
  getDistance,
  getMidpoint,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_STEP,
  zoomAtPoint,
  type Offset,
  type Point,
  type Size,
} from './zoom';

interface IUseImageZoomOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
}

interface IGesture {
  startZoom: number;
  startOffset: Offset;
  startPointers: Map<number, Point>;
  startDistance: number;
  startMidpoint: Point | null;
  moved: boolean;
}

interface IGeometry {
  content: Size;
  viewport: Size;
}

const DOUBLE_TAP_DELAY = 320;
const DOUBLE_TAP_DISTANCE = 30;
const TAP_MOVE_THRESHOLD = 10;
const DOUBLE_CLICK_SUPPRESSION = 600;

export function useImageZoom({ stageRef, imageRef }: IUseImageZoomOptions) {
  const reducedMotion = usePrefersReducedMotion();
  const [zoom, setZoomState] = useState(MIN_ZOOM);
  const [offset, setOffsetState] = useState<Offset>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const zoomRef = useRef(MIN_ZOOM);
  const offsetRef = useRef<Offset>({ x: 0, y: 0 });
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const gestureRef = useRef<IGesture | null>(null);
  const lastTapRef = useRef<{ time: number; point: Point } | null>(null);
  const suppressDoubleClickRef = useRef(0);

  const update = useCallback((nextZoom: number, nextOffset: Offset) => {
    zoomRef.current = nextZoom;
    offsetRef.current = nextOffset;
    setZoomState(nextZoom);
    setOffsetState(nextOffset);
  }, []);

  const measure = useCallback((): IGeometry | null => {
    const stage = stageRef.current;
    const image = imageRef.current;

    if (!stage || !image) {
      return null;
    }

    const content = { width: image.offsetWidth, height: image.offsetHeight };
    const viewport = { width: stage.clientWidth, height: stage.clientHeight };

    if (!content.width || !content.height || !viewport.width || !viewport.height) {
      return null;
    }

    return { content, viewport };
  }, [imageRef, stageRef]);

  const toLocalPoint = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const stage = stageRef.current;
      if (!stage) {
        return null;
      }

      const rect = stage.getBoundingClientRect();

      return {
        x: clientX - rect.left - rect.width / 2,
        y: clientY - rect.top - rect.height / 2,
      };
    },
    [stageRef]
  );

  const zoomToPoint = useCallback(
    (nextZoom: number, point: Point) => {
      const geometry = measure();
      if (!geometry) {
        return;
      }

      const result = zoomAtPoint({
        zoom: zoomRef.current,
        offset: offsetRef.current,
        nextZoom,
        point,
        ...geometry,
      });

      update(result.zoom, result.offset);
    },
    [measure, update]
  );

  const zoomAtClientPoint = useCallback(
    (nextZoom: number, clientX: number, clientY: number) => {
      zoomToPoint(nextZoom, toLocalPoint(clientX, clientY) ?? { x: 0, y: 0 });
    },
    [toLocalPoint, zoomToPoint]
  );

  const zoomIn = useCallback(() => {
    zoomToPoint(clampZoom(zoomRef.current * ZOOM_STEP), { x: 0, y: 0 });
  }, [zoomToPoint]);

  const zoomOut = useCallback(() => {
    zoomToPoint(clampZoom(zoomRef.current / ZOOM_STEP), { x: 0, y: 0 });
  }, [zoomToPoint]);

  const reset = useCallback(() => {
    update(MIN_ZOOM, { x: 0, y: 0 });
  }, [update]);

  const beginGesture = useCallback(() => {
    const points = [...pointersRef.current.values()];

    gestureRef.current = {
      startZoom: zoomRef.current,
      startOffset: offsetRef.current,
      startPointers: new Map(pointersRef.current),
      startDistance: points.length >= 2 ? getDistance(points[0], points[1]) : 0,
      startMidpoint: points.length >= 2 ? getMidpoint(points[0], points[1]) : null,
      moved: false,
    };
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (event.deltaY === 0) {
        return;
      }

      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomAtClientPoint(clampZoom(zoomRef.current * factor), event.clientX, event.clientY);
    };

    image.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      image.removeEventListener('wheel', handleWheel);
    };
  }, [imageRef, zoomAtClientPoint]);

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;

    if (!stage || !image) {
      return;
    }

    const reclamp = () => {
      const geometry = measure();
      if (!geometry) {
        return;
      }

      update(
        zoomRef.current,
        clampOffset(offsetRef.current, zoomRef.current, geometry.content, geometry.viewport)
      );
    };

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reclamp);

    observer?.observe(stage);
    observer?.observe(image);
    image.addEventListener('load', reclamp);
    reclamp();

    return () => {
      observer?.disconnect();
      image.removeEventListener('load', reclamp);
    };
  }, [imageRef, measure, stageRef, update]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      event.preventDefault();
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (typeof event.currentTarget.setPointerCapture === 'function') {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture can fail when the pointer is already released.
        }
      }

      setIsInteracting(true);
      beginGesture();
    },
    [beginGesture]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>) => {
      const pointers = pointersRef.current;
      if (!pointers.has(event.pointerId)) {
        return;
      }

      event.preventDefault();
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      const gesture = gestureRef.current;
      const geometry = measure();

      if (!gesture || !geometry) {
        return;
      }

      if (pointers.size >= 2) {
        const [first, second] = [...pointers.values()];

        if (gesture.startDistance <= 0 || !gesture.startMidpoint) {
          return;
        }

        const currentMidpoint = getMidpoint(first, second);
        const nextZoom = clampZoom(
          gesture.startZoom * (getDistance(first, second) / gesture.startDistance)
        );
        const startLocal = toLocalPoint(gesture.startMidpoint.x, gesture.startMidpoint.y);
        const currentLocal = toLocalPoint(currentMidpoint.x, currentMidpoint.y);

        if (!startLocal || !currentLocal) {
          return;
        }

        const ratio = nextZoom / gesture.startZoom;
        const nextOffset = {
          x: currentLocal.x - (startLocal.x - gesture.startOffset.x) * ratio,
          y: currentLocal.y - (startLocal.y - gesture.startOffset.y) * ratio,
        };

        update(
          nextZoom,
          clampOffset(nextOffset, nextZoom, geometry.content, geometry.viewport)
        );
        gesture.moved = true;
        return;
      }

      if (pointers.size === 1 && gesture.startZoom > MIN_ZOOM) {
        const start = gesture.startPointers.get(event.pointerId);
        if (!start) {
          return;
        }

        const nextOffset = {
          x: gesture.startOffset.x + (event.clientX - start.x),
          y: gesture.startOffset.y + (event.clientY - start.y),
        };

        update(
          zoomRef.current,
          clampOffset(nextOffset, zoomRef.current, geometry.content, geometry.viewport)
        );
        gesture.moved = true;
      }
    },
    [measure, toLocalPoint, update]
  );

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>, allowDoubleTap: boolean) => {
      const pointers = pointersRef.current;
      const gesture = gestureRef.current;
      const startPoint = gesture?.startPointers.get(event.pointerId);
      const wasSinglePointer = gesture?.startPointers.size === 1;
      const wasMoved = gesture?.moved ?? false;

      if (allowDoubleTap && event.pointerType !== 'mouse' && wasSinglePointer && !wasMoved) {
        const endPoint = { x: event.clientX, y: event.clientY };
        const movedDistance = startPoint ? getDistance(startPoint, endPoint) : Infinity;

        if (movedDistance < TAP_MOVE_THRESHOLD) {
          const now = Date.now();
          const lastTap = lastTapRef.current;

          if (
            lastTap &&
            now - lastTap.time < DOUBLE_TAP_DELAY &&
            getDistance(lastTap.point, endPoint) < DOUBLE_TAP_DISTANCE
          ) {
            lastTapRef.current = null;
            suppressDoubleClickRef.current = now;

            if (zoomRef.current > MIN_ZOOM) {
              update(MIN_ZOOM, { x: 0, y: 0 });
            } else {
              zoomAtClientPoint(Math.min(2, MAX_ZOOM), event.clientX, event.clientY);
            }
          } else {
            lastTapRef.current = { time: now, point: endPoint };
          }
        }
      }

      pointers.delete(event.pointerId);

      if (
        typeof event.currentTarget.releasePointerCapture === 'function' &&
        event.currentTarget.hasPointerCapture?.(event.pointerId)
      ) {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // The pointer may already be released by the browser.
        }
      }

      if (pointers.size === 0) {
        gestureRef.current = null;
        setIsInteracting(false);

        if (zoomRef.current <= MIN_ZOOM) {
          update(MIN_ZOOM, { x: 0, y: 0 });
        }
      } else {
        beginGesture();
      }
    },
    [beginGesture, update, zoomAtClientPoint]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>) => {
      handlePointerEnd(event, true);
    },
    [handlePointerEnd]
  );

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>) => {
      handlePointerEnd(event, false);
    },
    [handlePointerEnd]
  );

  const handleDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLImageElement>) => {
      if (Date.now() - suppressDoubleClickRef.current < DOUBLE_CLICK_SUPPRESSION) {
        return;
      }

      event.preventDefault();

      if (zoomRef.current > MIN_ZOOM) {
        update(MIN_ZOOM, { x: 0, y: 0 });
        return;
      }

      zoomAtClientPoint(Math.min(2, MAX_ZOOM), event.clientX, event.clientY);
    },
    [update, zoomAtClientPoint]
  );

  const imageStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
      transition: reducedMotion || isInteracting ? 'none' : undefined,
      willChange: zoom > MIN_ZOOM || isInteracting ? 'transform' : undefined,
    }),
    [isInteracting, offset.x, offset.y, reducedMotion, zoom]
  );

  return {
    zoom,
    offset,
    isInteracting,
    isZoomed: zoom > MIN_ZOOM,
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM,
    zoomIn,
    zoomOut,
    reset,
    imageStyle,
    imageHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onDoubleClick: handleDoubleClick,
    },
  };
}
