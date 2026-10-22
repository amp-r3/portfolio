'use client';

import type { FC } from 'react';
import { BenefitCard, type Project } from '@/entities/project';
import { externalLinkIcon, githubIcon } from '@/shared/assets';
import { useRouter } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { BackButton, Badge } from '@/shared/ui';
import style from './project-details.module.scss';

interface IProjectDetailsProps {
  project: Project;
}

export const ProjectDetails: FC<IProjectDetailsProps> = ({ project }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const { title, description, tools, githubLink, demoLink, image, darkImage, mobileImage, mobileDarkImage, benefits } =
    project;

  const themeImage = theme === 'dark' ? (darkImage ?? image ?? null) : (image ?? null);

  const mobileThemeImage =
    theme === 'dark'
      ? (mobileDarkImage ?? mobileImage ?? darkImage ?? image ?? null)
      : (mobileImage ?? image ?? null);

  return (
    <article className={`${style['project-details']} container page-content`}>
      <header className={style['project-details__header']}>
        <BackButton onClick={() => router.back()} ariaLabel="Go back" />
        <span className={style['project-details__category']}>Web App</span>
      </header>

      <div className={style['project-details__content']}>
        <h1 className={style['project-details__title']}>{title}</h1>
        <div className={style['project-details__description-wrapper']}>
          <p className={style['project-details__description']}>{description}</p>
        </div>

        <div className={style['project-details__tools']}>
          {tools.map((label) => (
            <Badge key={label} label={label} />
          ))}
        </div>

        <div className={style['project-details__actions']}>
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${style['project-details__action']} ${style['project-details__action--primary']}`}
          >
            <img src={externalLinkIcon} alt="" aria-hidden="true" />
            <span>Live Demo</span>
          </a>
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${style['project-details__action']} ${style['project-details__action--secondary']}`}
          >
            <img src={githubIcon} alt="" aria-hidden="true" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>

      <div className={style['project-details__media']}>
        <picture>
          <source media="(max-width: 576px)" srcSet={mobileThemeImage ?? undefined} />

          <img
            src={themeImage ?? undefined}
            alt={`Screenshot of the ${title} project`}
            className={style['project-details__image']}
          />
        </picture>
      </div>

      <section className={style['project-details__benefits']}>
        <div className={style['project-details__grid']}>
          {benefits &&
            benefits.map((item, index) => (
              <BenefitCard
                key={index}
                title={item.title}
                description={item.description}
                iconSrc={item.icon}
              />
            ))}
        </div>
      </section>
    </article>
  );
};
