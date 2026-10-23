import type { FC } from 'react';
import Image from 'next/image';
import { BenefitCard, type Project } from '@/entities/project';
import { externalLinkIcon, githubIcon } from '@/shared/assets';
import { BackButton, Badge } from '@/shared/ui';
import style from './project-details.module.scss';

interface IProjectDetailsProps {
  project: Project;
}

export const ProjectDetails: FC<IProjectDetailsProps> = ({ project }) => {
  const { title, description, tools, githubLink, demoLink, image, darkImage, mobileImage, mobileDarkImage, benefits } =
    project;

  const lightMain = image ?? null;
  const darkMain = darkImage ?? image ?? null;
  const lightMobile = mobileImage ?? image ?? null;
  const darkMobile = mobileDarkImage ?? mobileImage ?? darkImage ?? image ?? null;

  return (
    <article className={`${style['project-details']} container page-content`}>
      <header className={style['project-details__header']}>
        <BackButton ariaLabel="Go back" />
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
            <Image src={externalLinkIcon} alt="" width={16} height={16} unoptimized aria-hidden="true" />
            <span>Live Demo</span>
          </a>
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${style['project-details__action']} ${style['project-details__action--secondary']}`}
          >
            <Image src={githubIcon} alt="" width={16} height={16} unoptimized aria-hidden="true" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>

      <div className={style['project-details__media']}>
        {/* Light theme picture */}
        <picture className={`${style['project-details__picture']} ${style['project-details__picture--light']}`}>
          <source media="(max-width: 576px)" srcSet={lightMobile ?? undefined} />
          <img
            src={lightMain ?? undefined}
            alt={`Screenshot of the ${title} project`}
            className={style['project-details__image']}
          />
        </picture>

        {/* Dark theme picture */}
        <picture className={`${style['project-details__picture']} ${style['project-details__picture--dark']}`}>
          <source media="(max-width: 576px)" srcSet={darkMobile ?? undefined} />
          <img
            src={darkMain ?? undefined}
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
