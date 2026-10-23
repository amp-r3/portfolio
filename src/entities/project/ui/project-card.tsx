import type { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { backIcon } from '@/shared/assets';
import style from './project-card.module.scss';

interface IProjectCardProps {
  title: string;
  image: string;
  darkImage?: string;
  description: string;
}

export const ProjectCard: FC<IProjectCardProps> = ({ title, image, darkImage, description }) => {
  const t = useTranslations();

  return (
    <div className={style.projects__card}>
      <div className={style.projects__wrapper} data-label={t('projects.details')}>
        <Image
          src={image}
          alt={`Screenshot of ${title}`}
          width={640}
          height={360}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
          className={`${style.projects__img} ${darkImage ? style['projects__img--light'] : ''}`}
        />
        {darkImage && (
          <Image
            src={darkImage}
            alt={`Screenshot of ${title} (dark)`}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            className={`${style.projects__img} ${style['projects__img--dark']}`}
          />
        )}
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
          <Image src={backIcon} alt="" width={16} height={16} unoptimized />
        </span>
      </div>
    </div>
  );
};
