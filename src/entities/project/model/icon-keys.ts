/**
 * Canonical icon keys available to project content.
 *
 * Keep this list in sync with `PROJECT_ICONS` in `asset-map.ts`: the Zod schema
 * only accepts keys from here, so a typo in JSON fails project validation.
 */
export const projectIconKeys = [
  'geo',
  'adaptive',
  'performance',
  'server',
  'link',
  'puzzle',
  'search',
  'cart',
  'user',
  'package',
  'shield',
  'test',
  'palette',
  'mobile',
] as const;

export type ProjectIconKey = (typeof projectIconKeys)[number];
