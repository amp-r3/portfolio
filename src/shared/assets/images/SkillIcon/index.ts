import type { StaticImageData } from 'next/image';

const toSrc = (image: string | StaticImageData): string =>
  typeof image === 'string' ? image : image.src;

import htmlSvg from './htmlIcon.svg';
import cssSvg from './cssIcon.svg';
import sassSvg from './sassIcon.svg';
import jsSvg from './JSIcon.svg';
import tsSvg from './TSIcon.svg';
import reactSvg from './reactIcon.svg';
import reduxSvg from './reduxIcon.svg';
import gitSvg from './gitIcon.svg';
import figmaSvg from './figmaIcon.svg';
import viteSvg from './viteIcon.svg';
import reactRouterSvg from './reactRouterIcon.svg';
import axiosSvg from './axiosIcon.svg';
import netlifySvg from './netlifyIcon.svg';

export const htmlIcon = toSrc(htmlSvg);
export const cssIcon = toSrc(cssSvg);
export const sassIcon = toSrc(sassSvg);
export const JSIcon = toSrc(jsSvg);
export const TSIcon = toSrc(tsSvg);
export const reactIcon = toSrc(reactSvg);
export const reduxIcon = toSrc(reduxSvg);
export const gitIcon = toSrc(gitSvg);
export const figmaIcon = toSrc(figmaSvg);
export const viteIcon = toSrc(viteSvg);
export const reactRouterIcon = toSrc(reactRouterSvg);
export const axiosIcon = toSrc(axiosSvg);
export const netlifyIcon = toSrc(netlifySvg);
