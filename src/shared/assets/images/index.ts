import type { StaticImageData } from 'next/image';

const toSrc = (image: string | StaticImageData): string =>
  typeof image === 'string' ? image : image.src;

import telegramSvg from './telegram.svg';
import githubSvg from './github.svg';
import linkedinSvg from './linkedin.svg';
import emailSvg from './email.svg';
import logoSvg from './logo.svg';

export const telegramIcon = toSrc(telegramSvg);
export const githubIcon = toSrc(githubSvg);
export const linkedinIcon = toSrc(linkedinSvg);
export const emailIcon = toSrc(emailSvg);
export const logoIcon = toSrc(logoSvg);
