import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(path: string): string {
  return readFileSync(resolve(path), 'utf8');
}

describe('hero scroll choreography', () => {
  const heroStyles = readSource('src/widgets/hero/ui/hero-section.module.scss');
  const backgroundStyles = readSource('src/widgets/hero/ui/hero-background.module.scss');
  const layout = readSource('src/_app/ui/root-layout.tsx');
  const layoutStyles = readSource('src/_app/ui/root-layout.module.scss');
  const motion = readSource('src/shared/config/motion.ts');

  it('keeps the hero scrolling away instead of pinning it', () => {
    expect(heroStyles).toContain('position: relative;');
    expect(heroStyles).not.toContain('position: sticky;');
  });

  it('clips the hero and its oversized background layers', () => {
    expect(heroStyles).toContain('overflow: clip;');
    expect(backgroundStyles).toContain('overflow: clip;');
  });

  it('does not turn main into a scroll container', () => {
    expect(layout).not.toMatch(/overflow:\s*['"]hidden['"]/);
    expect(layoutStyles).toContain('overflow-x: clip;');
    expect(layoutStyles).not.toContain('overflow: hidden;');
    expect(layout).toContain('className={style.main}');
  });

  it('keeps the content parallax inside the clipped hero', () => {
    const minScale = Number(/minScale:\s*([\d.]+)/.exec(motion)?.[1]);
    const offsetEnd = Number(/offsetEnd:\s*'([\d.]+)%'/.exec(motion)?.[1]);

    expect(minScale).toBeGreaterThan(0);
    expect(offsetEnd).toBeGreaterThanOrEqual(0);
    expect(offsetEnd).toBeLessThanOrEqual((1 - minScale) * 50);
  });
});
