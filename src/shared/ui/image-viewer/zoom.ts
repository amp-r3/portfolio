export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 1.5;

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Offset {
  x: number;
  y: number;
}

interface IZoomAtPointParams {
  zoom: number;
  offset: Offset;
  nextZoom: number;
  /** Point relative to the viewport centre. */
  point: Point;
  content: Size;
  viewport: Size;
}

function clamp(value: number, min: number, max: number): number {
  const result = Math.min(max, Math.max(min, value));
  return result === 0 ? 0 : result;
}

export function clampZoom(value: number): number {
  if (!Number.isFinite(value)) return MIN_ZOOM;
  return clamp(value, MIN_ZOOM, MAX_ZOOM);
}

/**
 * Keeps the image inside the viewport. When the scaled image is smaller than
 * the viewport, the offset collapses to zero so the image stays centred.
 */
export function clampOffset(offset: Offset, zoom: number, content: Size, viewport: Size): Offset {
  const maxX = Math.max(0, (content.width * zoom - viewport.width) / 2);
  const maxY = Math.max(0, (content.height * zoom - viewport.height) / 2);

  return {
    x: clamp(offset.x, -maxX, maxX),
    y: clamp(offset.y, -maxY, maxY),
  };
}

/**
 * Zooms around a point so the content under the cursor/fingers stays put.
 * `point` and the returned offset are relative to the viewport centre.
 */
export function zoomAtPoint({
  zoom,
  offset,
  nextZoom,
  point,
  content,
  viewport,
}: IZoomAtPointParams): { zoom: number; offset: Offset } {
  const clampedZoom = clampZoom(nextZoom);

  if (zoom <= 0 || clampedZoom === zoom) {
    return { zoom: clampedZoom, offset: clampOffset(offset, clampedZoom, content, viewport) };
  }

  const ratio = clampedZoom / zoom;
  const nextOffset = {
    x: point.x - (point.x - offset.x) * ratio,
    y: point.y - (point.y - offset.y) * ratio,
  };

  return {
    zoom: clampedZoom,
    offset: clampOffset(nextOffset, clampedZoom, content, viewport),
  };
}

export function getDistance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function getMidpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
