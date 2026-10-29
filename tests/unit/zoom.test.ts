import { describe, expect, it } from 'vitest';
import {
  clampOffset,
  clampZoom,
  getDistance,
  getMidpoint,
  MAX_ZOOM,
  MIN_ZOOM,
  zoomAtPoint,
} from '@/shared/ui';

describe('image viewer zoom math', () => {
  it('clamps zoom to the supported range', () => {
    expect(clampZoom(Number.NaN)).toBe(MIN_ZOOM);
    expect(clampZoom(0.5)).toBe(MIN_ZOOM);
    expect(clampZoom(2.25)).toBe(2.25);
    expect(clampZoom(10)).toBe(MAX_ZOOM);
  });

  it('centres content that is smaller than the viewport', () => {
    expect(
      clampOffset({ x: 120, y: -80 }, 1, { width: 800, height: 600 }, { width: 1000, height: 1000 })
    ).toEqual({ x: 0, y: 0 });
  });

  it('limits panning to the scaled image bounds', () => {
    expect(
      clampOffset({ x: 100, y: -100 }, 2, { width: 1000, height: 1000 }, { width: 1000, height: 1000 })
    ).toEqual({ x: 100, y: -100 });

    expect(
      clampOffset({ x: 900, y: -900 }, 2, { width: 1000, height: 1000 }, { width: 1000, height: 1000 })
    ).toEqual({ x: 500, y: -500 });
  });

  it('keeps the content under the pointer while zooming', () => {
    const result = zoomAtPoint({
      zoom: 1,
      offset: { x: 0, y: 0 },
      nextZoom: 2,
      point: { x: 100, y: 0 },
      content: { width: 1000, height: 1000 },
      viewport: { width: 1000, height: 1000 },
    });

    expect(result.zoom).toBe(2);
    expect(result.offset).toEqual({ x: -100, y: 0 });
  });

  it('returns the same offset when zooming around the centre', () => {
    const result = zoomAtPoint({
      zoom: 1,
      offset: { x: 0, y: 0 },
      nextZoom: 2,
      point: { x: 0, y: 0 },
      content: { width: 1000, height: 1000 },
      viewport: { width: 1000, height: 1000 },
    });

    expect(result.offset).toEqual({ x: 0, y: 0 });
  });

  it('does not zoom beyond the maximum even at the edge', () => {
    const result = zoomAtPoint({
      zoom: 3,
      offset: { x: 0, y: 0 },
      nextZoom: 8,
      point: { x: 400, y: 400 },
      content: { width: 1000, height: 1000 },
      viewport: { width: 1000, height: 1000 },
    });

    expect(result.zoom).toBe(MAX_ZOOM);
    expect(Math.abs(result.offset.x)).toBeLessThanOrEqual(1500);
    expect(Math.abs(result.offset.y)).toBeLessThanOrEqual(1500);
  });

  it('computes distance and midpoint for pinch gestures', () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(getMidpoint({ x: 0, y: 0 }, { x: 4, y: 6 })).toEqual({ x: 2, y: 3 });
  });
});
