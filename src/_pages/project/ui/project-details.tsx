'use client';

import type { FC } from 'react';
import Image, { getImageProps } from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { externalLinkIcon, githubIcon } from '@/shared/assets';
import { BackButton, Badge } from '@/shared/ui';
import { ProjectMeta } from './project-meta';
import { ProjectOverview } from './project-overview';
import { ProjectAccordions } from './project-accordions';
import style from './project-details.module.scss';

interface IProjectDetailsProps {
  project: Project;
}

const DESKTOP_IMAGE = { width: 1920, height: 1080 };
const MOBILE_IMAGE = { width: 1080, height: 2400 };
const DESKTOP_IMAGE_SIZES = '(min-width: 1024px) 55vw, 100vw';
const MOBILE_IMAGE_SIZES = '100vw';

export const ProjectDetails: FC<IProjectDetailsProps> = ({ project }) => {
  const t = useTranslations('projects');
  const { title, tagline, stack, links, images } = project;

  const lightMain = images.light;
  const darkMain = images.dark ?? images.light;
  const lightMobile = images.mobileLight ?? images.light;
  const darkMobile = images.mobileDark ?? images.mobileLight ?? images.dark ?? images.light;
  const primaryStack = stack.primary.slice(0, 5);
  const screenshotAlt = t('screenshotAlt', { title });

  const lightDesktopImage = getImageProps({
    src: lightMain,
    alt: screenshotAlt,
    sizes: DESKTOP_IMAGE_SIZES,
    loading: 'eager',
    fetchPriority: 'high',
    ...DESKTOP_IMAGE,
  }).props;
  const lightMobileImage = getImageProps({
    src: lightMobile,
    alt: screenshotAlt,
    sizes: MOBILE_IMAGE_SIZES,
    loading: 'eager',
    fetchPriority: 'high',
    ...MOBILE_IMAGE,
  }).props;
  const darkDesktopImage = getImageProps({
    src: darkMain,
    alt: screenshotAlt,
    sizes: DESKTOP_IMAGE_SIZES,
    loading: 'eager',
    fetchPriority: 'high',
    ...DESKTOP_IMAGE,
  }).props;
  const darkMobileImage = getImageProps({
    src: darkMobile,
    alt: screenshotAlt,
    sizes: MOBILE_IMAGE_SIZES,
    loading: 'eager',
    fetchPriority: 'high',
    ...MOBILE_IMAGE,
  }).props;

  return (
    <article className={`${style['project-details']} container page-content`}>
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
                <Image src={externalLinkIcon} alt="" width={16} height={16} unoptimized aria-hidden="true" />
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
          {/* Light theme picture */}
          <picture className={`${style['project-details__picture']} ${style['project-details__picture--light']}`}>
            <source
              media="(max-width: 639px)"
              srcSet={lightMobileImage.srcSet}
              sizes={lightMobileImage.sizes}
            />
            <img {...lightDesktopImage} alt={screenshotAlt} className={style['project-details__image']} />
          </picture>

          {/* Dark theme picture */}
          <picture className={`${style['project-details__picture']} ${style['project-details__picture--dark']}`}>
            <source
              media="(max-width: 639px)"
              srcSet={darkMobileImage.srcSet}
              sizes={darkMobileImage.sizes}
            />
            <img {...darkDesktopImage} alt={screenshotAlt} className={style['project-details__image']} />
          </picture>
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
