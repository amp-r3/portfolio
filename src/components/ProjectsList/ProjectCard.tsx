import type { FC } from 'react'
import style from './projectsList.module.scss'

interface IProjectCardProps {
    id: string,
    title: string,
    image: string,
    description: string,
    link: string
}


const ProjectCard: FC<IProjectCardProps> = ({ title, image, description, link }) => {
    return (
        <a href={link} target="_blank" rel="noreferrer" className={style.projects__card}>
            <div className={style.projects__wrapper}>
                <img src={image} alt="" className={style.projects__img} />
            </div>
            <h2 className={style.projects__title}>{title}</h2>
            <div className={style.projects__description_wrapper}>
                <p className={style.projects__description}>{description}</p>
            </div>
        </a>
    )
}

export default ProjectCard