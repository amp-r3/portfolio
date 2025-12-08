import type { FC } from 'react'
import style from './projectsList.module.scss'
import { backIcon } from '@/assets/images'
import { useTranslation } from 'react-i18next'

interface IProjectCardProps {
    id: string,
    title: string,
    image: string,
    description: string,
}

const ProjectCard: FC<IProjectCardProps> = ({ title, image, description }) => {
    const { t } = useTranslation()
    return (
        <div className={style.projects__card}>
            <div className={style.projects__wrapper} data-label={t('projects.details')}>
                <img src={image} alt="" className={style.projects__img} />
            </div>
            <div className={style.projects__content}>
                <h2 className={style.projects__title}>{title}</h2>
                <div className={style.projects__description_wrapper}>
                    <p className={style.projects__description}>{description}</p>
                </div>
            </div>
            <div className={style.projects__footer}>
                <span className={style.projects__more}>{t('projects.details')}</span>
                <span className={style.projects__arrow}>
                    <img src={backIcon} alt="" />
                </span>
            </div>
        </div>
    )
}

export default ProjectCard