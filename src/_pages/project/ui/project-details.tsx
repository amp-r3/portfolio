'use client';

import { type FC } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { ProjectGallery } from '@/features/project-gallery';
import { githubIcon } from '@/shared/assets';
import { BackButton, Badge } from '@/shared/ui';
import { ProjectMeta } from './project-meta';
import { ProjectOverview } from './project-overview';
import { ProjectAccordions } from './project-accordions';
import style from './project-details.module.scss';

interface IProjectDetailsProps {
  project: Project;
}

export const ProjectDetails: FC<IProjectDetailsProps> = ({ project }) => {
  const t = useTranslations('projects');
  const { title, tagline, stack, links, images } = project;

  const primaryStack = stack.primary.slice(0, 5);

  return (
    <article className={`${style['project-details']} page-content`}>
      <header className={style['project-details__header']}>
        <BackButton ariaLabel={t('actions.back')} />
      </header>

      <div className={style['project-details__hero']}>
        <div className={style['project-details__heroText']}>
          <h1 className={style['project-details__title']}>{title}</h1>
          <p className={style['project-details__description']}>{tagline}</p>

          <ProjectMeta project={project} />
        </div>

        {(links.demo || links.github) && (
          <div className={style['project-details__actions']}>
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${style['project-details__action']} ${style['project-details__action--primary']}`}
              >
                <ExternalLink size={16} aria-hidden="true" />
                <span>{t('actions.demo')}</span>
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${style['project-details__action']} ${style['project-details__action--secondary']}`}
              >
                <Image src={githubIcon} alt="" width={16} height={16} unoptimized aria-hidden="true" />
                <span>{t('actions.github')}</span>
              </a>
            )}
          </div>
        )}

        <div className={style['project-details__media']}>
          <ProjectGallery images={images} title={title} />
        </div>

        {primaryStack.length > 0 && (
          <div className={style['project-details__tools']}>
            {primaryStack.map((label) => (
              <Badge key={label} label={label} />
            ))}
          </div>
        )}
      </div>

      <ProjectOverview project={project} className={style['project-details__layer']} />
      <ProjectAccordions project={project} className={style['project-details__layer']} />
    </article>
  );
};
