import type { StaticImageData } from 'next/image';

const toSrc = (image: string | StaticImageData): string =>
  typeof image === 'string' ? image : image.src;

import telegramSvg from './telegram.svg';
import githubSvg from './github.svg';
import linkedinSvg from './linkedin.svg';
import emailSvg from './emailIcon.svg';
import langSvg from './lang.svg';
import sunSvg from './sunIcon.svg';
import moonSvg from './moonIcon.svg';
import backSvg from './backIcon.svg';
import externalLinkSvg from './externalLink.svg';
import adaptiveSvg from './smartphoneIcon.svg';
import performanceSvg from './lightningIcon.svg';
import geoSvg from './geoIcon.svg';
import linkSvg from './linkIcon.svg';
import serverSvg from './serverIcon.svg';
import puzzleSvg from './puzzleIcon.svg';
import logoSvg from './logo.svg';

export const telegramIcon = toSrc(telegramSvg);
export const githubIcon = toSrc(githubSvg);
export const linkedinIcon = toSrc(linkedinSvg);
export const emailIcon = toSrc(emailSvg);
export const langIcon = toSrc(langSvg);
export const sunIcon = toSrc(sunSvg);
export const moonIcon = toSrc(moonSvg);
export const backIcon = toSrc(backSvg);
export const externalLinkIcon = toSrc(externalLinkSvg);
export const adaptiveIcon = toSrc(adaptiveSvg);
export const performanceIcon = toSrc(performanceSvg);
export const geoIcon = toSrc(geoSvg);
export const linkIcon = toSrc(linkSvg);
export const serverIcon = toSrc(serverSvg);
export const puzzleIcon = toSrc(puzzleSvg);
export const logoIcon = toSrc(logoSvg);
