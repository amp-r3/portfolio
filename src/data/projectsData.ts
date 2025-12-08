import { store, weatherDark, weatherLight } from "@/assets/images/ProjectImages";

export const projectsData = [
    { id: 'weather', title: 'My Weather App', image: weatherLight, darkImage: weatherDark, descKey: 'projects.weatherDescription', tools: ['React', 'Redux Toolkit', 'Axios', 'React Router', 'Vite (SWC)', 'Sass', 'OpenWeatherMap API', 'Geoapify API', 'ipapi.co', 'Geolocation API', 'LocalStorage API'], demoLink: 'https://my-pogoda.netlify.app/', githubLink: 'https://github.com/amp-r3/weather' },
    { id: 'store', title: 'Store App', image: store, descKey: 'projects.storeDescription', tools: ['React', 'JavaScript', 'Redux Toolkit', 'React Router', 'Axios', 'Vite', 'Sass', 'React Icons', 'Reselect', 'DummyJSON API'], demoLink: 'https://amp-r3-store.netlify.app/', githubLink: 'https://github.com/amp-r3/store' }
]