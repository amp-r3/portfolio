'use client';

import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { ProjectCard } from '@/entities/project';
import style from './projects-section.module.scss';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations();

  return (
    <section id="projects" className={style.projects}>
      <div className="container">
        <div className={style.projects__header}>
          <h1 className={style.projects__main_title}>{t('projects.title')}</h1>
        </div>
        <div className={style.projects__cards}>
          {projects.map((elem) => (
            <ProjectCard
              key={elem.id}
              href={`/project/${elem.id}`}
              title={elem.title}
              image={elem.images.light}
              darkImage={elem.images.dark}
              description={elem.tagline}
              demo={elem.links.demo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
