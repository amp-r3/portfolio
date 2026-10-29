import type { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/shared/i18n';
import style from './project-card.module.scss';

interface IProjectCardProps {
  href: string;
  title: string;
  image: string;
  darkImage?: string;
  description: string;
  demo?: string;
  github?: string;
}

export const ProjectCard: FC<IProjectCardProps> = ({
  href,
  title,
  image,
  darkImage,
  description,
  demo,
  github,
}) => {
  const t = useTranslations('projects');

  return (
    <div className={style.projects__card}>
      <Link
        href={href}
        className={style.projects__wrapper}
        data-label={t('card.open')}
        aria-label={t('card.open')}
      >
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
      </Link>
      <div className={style.projects__content}>
        <h2 className={style.projects__title}>{title}</h2>
        <div className={style.projects__description_wrapper}>
          <p className={style.projects__description}>{description}</p>
        </div>
      </div>
      {(demo || github) && (
        <div className={style.projects__actions}>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${style.projects__action} ${style['projects__action--primary']}`}
            >
              <span>{t('card.demo')}</span>
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${style.projects__action} ${style['projects__action--secondary']} ${
                demo ? style['projects__action--github'] : ''
              }`}
            >
              <span>{t('card.github')}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
