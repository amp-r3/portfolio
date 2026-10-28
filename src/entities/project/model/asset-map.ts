import {
  adaptiveIcon,
  cartIcon,
  geoIcon,
  linkIcon,
  mobileIcon,
  packageIcon,
  paletteIcon,
  performanceIcon,
  puzzleIcon,
  searchIcon,
  serverIcon,
  shieldIcon,
  storeDark,
  storeMobileDark,
  testIcon,
  userIcon,
  weatherDark,
  weatherDarkMobile,
  weatherLight,
  weatherLightMobile,
} from '@/shared/assets';
import { ProjectSourceError } from '../api/project-source-error';
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
  geo: geoIcon,
  adaptive: adaptiveIcon,
  performance: performanceIcon,
  server: serverIcon,
  link: linkIcon,
  puzzle: puzzleIcon,
  search: searchIcon,
  cart: cartIcon,
  user: userIcon,
  package: packageIcon,
  shield: shieldIcon,
  test: testIcon,
  palette: paletteIcon,
  mobile: mobileIcon,
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
