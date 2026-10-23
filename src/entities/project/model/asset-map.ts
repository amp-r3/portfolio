import {
  adaptiveIcon,
  geoIcon,
  linkIcon,
  performanceIcon,
  puzzleIcon,
  serverIcon,
  storeDark,
  storeLight,
  storeMobileDark,
  storeMobileLight,
  weatherDark,
  weatherDarkMobile,
  weatherLight,
  weatherLightMobile,
} from '@/shared/assets';
import { ProjectSourceError } from '../api/project-source-error';

export const PROJECT_IMAGES: Record<string, string> = {
  weatherLight,
  weatherDark,
  weatherLightMobile,
  weatherDarkMobile,
  storeLight,
  storeDark,
  storeMobileLight,
  storeMobileDark,
};

export const PROJECT_ICONS: Record<string, string> = {
  geo: geoIcon,
  adaptive: adaptiveIcon,
  performance: performanceIcon,
  server: serverIcon,
  link: linkIcon,
  puzzle: puzzleIcon,
  geoIcon,
  adaptiveIcon,
  performanceIcon,
  serverIcon,
  linkIcon,
  puzzleIcon,
};

export function resolveProjectImage(key: string): string {
  const image = PROJECT_IMAGES[key];
  if (!image) {
    throw new ProjectSourceError(`Unknown project image key: "${key}"`);
  }
  return image;
}

export function resolveProjectIcon(key: string): string {
  const icon = PROJECT_ICONS[key];
  if (!icon) {
    throw new ProjectSourceError(`Unknown project benefit icon key: "${key}"`);
  }
  return icon;
}
