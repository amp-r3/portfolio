import type { FC } from 'react';
import { useTranslations } from 'next-intl';
import { backIcon } from '@/shared/assets';
import style from './project-card.module.scss';

interface IProjectCardProps {
  title: string;
  image: string;
  description: string;
}

export const ProjectCard: FC<IProjectCardProps> = ({ title, image, description }) => {
  const t = useTranslations();

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
  );
};
