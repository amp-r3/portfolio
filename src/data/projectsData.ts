import { myWeather, store } from "@/assets/images/ProjectImages";

export const projectsData = [
    { id: 'weather', title: 'My Weather App', image: myWeather, descKey: 'projects.weatherDescription', tools: ['React', 'Redux Toolkit', 'Axios', 'React Router', 'Vite (SWC)', 'Sass', 'OpenWeatherMap API', 'Geoapify API', 'ipapi.co', 'Geolocation API', 'LocalStorage API'], link: 'https://my-pogoda.netlify.app/' },
    { id: 'store', title: 'Store App', image: store, descKey: 'projects.storeDescription', tools: ['React', 'JavaScript', 'Redux Toolkit', 'React Router', 'Axios', 'Vite', 'Sass', 'React Icons', 'Reselect', 'DummyJSON API'], link: 'https://amp-r3-store.netlify.app/' }
]