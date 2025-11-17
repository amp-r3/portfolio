import { myWeather, store } from '@/assets/images/ProjectImages'
import ProjectCard from './ProjectCard'
import style from './projectsSection.module.scss'
import { useTranslation } from 'react-i18next'

const ProjectsSection = () => {

    const { t } = useTranslation()

    const weatherDescription = t('projects.weatherDescription')

    const storeDescription = t('projects.storeDescription')


    const projectsArray = [
        { title: 'My Weather App', image: myWeather, description: weatherDescription, link: 'https://my-pogoda.netlify.app/' },
        { title: 'Store App', image: store, description: storeDescription, link: 'https://amp-r3-store.netlify.app/' }
    ]

    return (
        <div id='projects' className={style.projects}>
            <div className="container">
                <div className={style.projects__header}>
                    <h1 className={style.projects__main_title}>{t('projects.title')}</h1>
                </div>
                <div className={style.projects__cards}>
                    {
                        projectsArray.map((elem) => (
                            <ProjectCard key={elem.title} title={elem.title} image={elem.image} description={elem.description} link={elem.link} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ProjectsSection