import {
  storeDark,
  storeMobileDark,
  weatherDark,
  weatherDarkMobile,
  weatherLight,
  weatherLightMobile,
} from '@/shared/assets';
import { ProjectSourceError } from './project-source-error';
import type { ProjectIconKey } from './icon-keys';

export const PROJECT_IMAGES: Record<string, string> = {
  weatherLight,
  weatherDark,
  weatherLightMobile,
  weatherDarkMobile,
  storeDark,
  storeMobileDark,
};

export const PROJECT_ICONS: Record<ProjectIconKey, string> = {
  geo: 'geo',
  adaptive: 'adaptive',
  performance: 'performance',
  server: 'server',
  link: 'link',
  puzzle: 'puzzle',
  search: 'search',
  cart: 'cart',
  user: 'user',
  package: 'package',
  shield: 'shield',
  test: 'test',
  palette: 'palette',
  mobile: 'mobile',
};

export function resolveProjectImage(key: string): string {
  const image = PROJECT_IMAGES[key];
  if (!image) {
    throw new ProjectSourceError(`Unknown project image key: "${key}"`);
  }
  return image;
}

export function resolveProjectIcon(key: ProjectIconKey): string {
  const icon = PROJECT_ICONS[key];
  if (!icon) {
    throw new ProjectSourceError(`Unknown project icon key: "${key}"`);
  }
  return icon;
}
