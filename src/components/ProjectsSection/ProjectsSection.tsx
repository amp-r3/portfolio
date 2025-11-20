import { myWeather, store } from '@/assets/images/ProjectImages'
import ProjectCard from './ProjectCard'
import style from './projectsSection.module.scss'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
}

const titleVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)',
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            type: 'spring',
            damping: 22,
            stiffness: 100
        }
    }
}

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.95,
        filter: 'blur(5px)'
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 90
        }
    }
}

const ProjectsSection = () => {
    const { t } = useTranslation()
    const weatherDescription = t('projects.weatherDescription')
    const storeDescription = t('projects.storeDescription')

    const projectsArray = [
        { title: 'My Weather App', image: myWeather, description: weatherDescription, link: 'https://my-pogoda.netlify.app/' },
        { title: 'Store App', image: store, description: storeDescription, link: 'https://amp-r3-store.netlify.app/' }
    ]

    return (
        <section id='projects' className={style.projects}>
            <motion.div
                className="container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            >
                <div className={style.projects__header}>
                    <motion.h1
                        variants={titleVariants}
                        className={style.projects__main_title}
                    >
                        {t('projects.title')}
                    </motion.h1>
                </div>
                <div className={style.projects__cards}>
                    {projectsArray.map((elem) => (
                        <motion.div
                            key={elem.title}
                            variants={cardVariants}
                            className={style.projects__card_wrapper}
                        >
                            <ProjectCard
                                title={elem.title}
                                image={elem.image}
                                description={elem.description}
                                link={elem.link}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default ProjectsSection