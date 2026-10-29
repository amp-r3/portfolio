import type { StaticImageData } from 'next/image';

const toSrc = (image: string | StaticImageData): string =>
  typeof image === 'string' ? image : image.src;

import rawClockDark from './clockDark.png';
import rawClockLight from './clockLight.png';
import rawClockMobileDark from './clockMobileDark.png';
import rawClockMobileLight from './clockMobileLight.png';
import rawPalmaDark from './palmaDark.png';
import rawPalmaMobileDark from './palmaMobileDark.png';
import rawWeatherLight from './weatherLight.png';
import rawWeatherDark from './weatherDark.png';
import rawWeatherLightMobile from './weatherMobileLight.png';
import rawWeatherDarkMobile from './weatherMobileDark.png';
import rawStoreDark from './storeDark.png';
import rawStoreMobileDark from './storeMobileDark.png';

export const clockDark = toSrc(rawClockDark);
export const clockLight = toSrc(rawClockLight);
export const clockMobileDark = toSrc(rawClockMobileDark);
export const clockMobileLight = toSrc(rawClockMobileLight);
export const palmaDark = toSrc(rawPalmaDark);
export const palmaMobileDark = toSrc(rawPalmaMobileDark);
export const weatherLight = toSrc(rawWeatherLight);
export const weatherDark = toSrc(rawWeatherDark);
export const weatherLightMobile = toSrc(rawWeatherLightMobile);
export const weatherDarkMobile = toSrc(rawWeatherDarkMobile);
export const storeDark = toSrc(rawStoreDark);
export const storeMobileDark = toSrc(rawStoreMobileDark);
