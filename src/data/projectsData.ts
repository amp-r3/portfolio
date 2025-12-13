import { adaptiveIcon, geoIcon, linkIcon, performanceIcon, puzzleIcon, serverIcon } from "@/assets/images";
import { store, storeMobile, weatherDark, weatherDarkMobile, weatherLight, weatherLightMobile } from "@/assets/images/ProjectImages";

export interface ProjectBenefit {
    titleKey: string;
    descKey: string;
    icon: string;
}

export interface Project {
    id: string;
    title: string;
    image: string;
    darkImage?: string;
    mobileImage?: string;
    mobileDarkImage?: string;
    descKey: string;
    tools: string[];
    demoLink: string;
    githubLink: string;
    benefits: ProjectBenefit[];
}

export const projectsData: Project[] = [
    {
        id: 'weather',
        title: 'My Weather App',
        image: weatherLight,
        darkImage: weatherDark,
        mobileImage: weatherLightMobile,
        mobileDarkImage: weatherDarkMobile,
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
            'LocalStorage API'
        ],
        demoLink: 'https://my-pogoda.netlify.app/',
        githubLink: 'https://github.com/amp-r3/weather',
        benefits: [
            {
                titleKey: 'projects.benefits.weather.geo.title',
                descKey: 'projects.benefits.weather.geo.description',
                icon: geoIcon
            },
            {
                titleKey: 'projects.benefits.weather.adaptive.title',
                descKey: 'projects.benefits.weather.adaptive.description',
                icon: adaptiveIcon
            },
            {
                titleKey: 'projects.benefits.weather.performance.title',
                descKey: 'projects.benefits.weather.performance.description',
                icon: performanceIcon
            }
        ]
    },
    {
        id: 'store',
        title: 'Store App',
        image: store,
        mobileImage: storeMobile,
        descKey: 'projects.storeDescription',
        tools: [
            'React',
            'JavaScript',
            'Redux Toolkit',
            'React Router',
            'Axios',
            'Vite',
            'Sass',
            'React Icons',
            'Reselect',
            'DummyJSON API'
        ],
        demoLink: 'https://amp-r3-store.netlify.app/',
        githubLink: 'https://github.com/amp-r3/store',
        benefits: [
            {
                titleKey: 'projects.benefits.store.api.title',
                descKey: 'projects.benefits.store.api.description',
                icon: serverIcon
            },
            {
                titleKey: 'projects.benefits.store.url.title',
                descKey: 'projects.benefits.store.url.description',
                icon: linkIcon
            },
            {
                titleKey: 'projects.benefits.store.architecture.title',
                descKey: 'projects.benefits.store.architecture.description',
                icon: puzzleIcon
            }
        ]
    }
];