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
import type { ProjectId } from './project-id';

export interface RawProjectBenefit {
  titleKey: string;
  descKey: string;
  icon: string;
}

export interface RawProject {
  id: ProjectId;
  title: string;
  descKey: string;
  tools: string[];
  demoLink: string;
  githubLink: string;
  images: {
    light: string;
    dark?: string;
    mobileLight?: string;
    mobileDark?: string;
  };
  benefits: RawProjectBenefit[];
}

export const rawProjects: RawProject[] = [
  {
    id: 'weather',
    title: 'My Weather App',
    images: {
      light: weatherLight,
      dark: weatherDark,
      mobileLight: weatherLightMobile,
      mobileDark: weatherDarkMobile,
    },
    descKey: 'projects.weatherDescription',
    tools: [
      'React',
      'Redux Toolkit',
      'Axios',
      'React Router',
      'Vite (SWC)',
      'Sass',
      'OpenWeatherMap API',
      'Geoapify API',
      'ipapi.co',
      'Geolocation API',
      'LocalStorage API',
    ],
    demoLink: 'https://my-pogoda.netlify.app/',
    githubLink: 'https://github.com/amp-r3/weather',
    benefits: [
      {
        titleKey: 'projects.benefits.weather.geo.title',
        descKey: 'projects.benefits.weather.geo.description',
        icon: geoIcon,
      },
      {
        titleKey: 'projects.benefits.weather.adaptive.title',
        descKey: 'projects.benefits.weather.adaptive.description',
        icon: adaptiveIcon,
      },
      {
        titleKey: 'projects.benefits.weather.performance.title',
        descKey: 'projects.benefits.weather.performance.description',
        icon: performanceIcon,
      },
    ],
  },
  {
    id: 'store',
    title: 'Store App',
    images: {
      light: storeLight,
      dark: storeDark,
      mobileLight: storeMobileLight,
      mobileDark: storeMobileDark,
    },
    descKey: 'projects.storeDescription',
    tools: [
      'React',
      'TypeScript',
      'Redux Toolkit',
      'RTK Query',
      'redux-persist',
      'React Router',
      'Vite',
      'SCSS Modules',
      'React Icons',
      'Reselect',
      'Vaul',
      'DummyJSON API',
    ],
    demoLink: 'https://amp-r3-store.netlify.app/',
    githubLink: 'https://github.com/amp-r3/store',
    benefits: [
      {
        titleKey: 'projects.benefits.store.api.title',
        descKey: 'projects.benefits.store.api.description',
        icon: serverIcon,
      },
      {
        titleKey: 'projects.benefits.store.url.title',
        descKey: 'projects.benefits.store.url.description',
        icon: linkIcon,
      },
      {
        titleKey: 'projects.benefits.store.architecture.title',
        descKey: 'projects.benefits.store.architecture.description',
        icon: puzzleIcon,
      },
    ],
  },
];
