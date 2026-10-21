import type { StaticImageData } from 'next/image';

const toSrc = (image: string | StaticImageData): string =>
  typeof image === 'string' ? image : image.src;

import rawWeatherLight from './weatherLight.png';
import rawWeatherDark from './weatherDark.png';
import rawWeatherLightMobile from './weatherMobileLight.png';
import rawWeatherDarkMobile from './weatherMobileDark.png';
import rawStoreLight from './storeLight.png';
import rawStoreDark from './storeDark.png';
import rawStoreMobileLight from './storeMobileLight.png';
import rawStoreMobileDark from './storeMobileDark.png';

export const weatherLight = toSrc(rawWeatherLight);
export const weatherDark = toSrc(rawWeatherDark);
export const weatherLightMobile = toSrc(rawWeatherLightMobile);
export const weatherDarkMobile = toSrc(rawWeatherDarkMobile);
export const storeLight = toSrc(rawStoreLight);
export const storeDark = toSrc(rawStoreDark);
export const storeMobileLight = toSrc(rawStoreMobileLight);
export const storeMobileDark = toSrc(rawStoreMobileDark);
