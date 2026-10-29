import type { FC } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
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
}

export const ProjectCard: FC<IProjectCardProps> = ({
  href,
  title,
  image,
  darkImage,
  description,
  demo,
}) => {
  const t = useTranslations('projects');

  return (
    <div className={style.projects__card}>
      <Link
        href={href}
        className={style.projects__wrapper}
      >
        <Image
          src={image}
          alt={`Screenshot of ${title}`}
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className={`${style.projects__img} ${darkImage ? style['projects__img--light'] : ''}`}
        />
        {darkImage && (
          <Image
            src={darkImage}
            alt={`Screenshot of ${title} (dark)`}
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            className={`${style.projects__img} ${style['projects__img--dark']}`}
          />
        )}
      </Link>
      <div className={style.projects__content}>
        <h2 className={style.projects__title}>
          <Link href={href} className={style.projects__title_link}>
            {title}
          </Link>
        </h2>
        <div className={style.projects__description_wrapper}>
          <p className={style.projects__description}>{description}</p>
        </div>
      </div>
      <div className={style.projects__actions}>
        <Link
          href={href}
          className={`${style.projects__action} ${style['projects__action--primary']}`}
        >
          <span>{t('card.details')}</span>
        </Link>
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`${style.projects__action} ${style['projects__action--secondary']}`}
          >
            <span>{t('card.demo')}</span>
            <ExternalLink size={14} aria-hidden="true" className={style.projects__action_icon} />
          </a>
        )}
      </div>
    </div>
  );
};
