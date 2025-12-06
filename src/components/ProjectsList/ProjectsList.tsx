import ProjectCard from './ProjectCard'
import style from './projectsList.module.scss'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { projectsData } from '@/data/projectsData'
import { useTheme } from '@/hooks/useTheme'

const ProjectsSection = () => {
    const { t } = useTranslation()
    const { theme } = useTheme()



    return (
        <section id='projects' className={style.projects}>
            <div className="container">
                <div className={style.projects__header}>
                    <h1 className={style.projects__main_title}>
                        {t('projects.title')}
                    </h1>
                </div>
                <div className={style.projects__cards}>
                    {projectsData.map((elem) => {
                        const description = t(elem.descKey)
                        let themeImage = elem.image;
                        if (elem.darkImage && theme === 'dark') {
                            themeImage = elem.darkImage
                        }
                        return (
                            <Link to={`project/${elem.id}`} key={elem.id} className={style.projects__card_wrapper}>
                                <ProjectCard
                                    id={elem.id}
                                    title={elem.title}
                                    image={themeImage}
                                    description={description}
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section >
    )
}

export default ProjectsSection