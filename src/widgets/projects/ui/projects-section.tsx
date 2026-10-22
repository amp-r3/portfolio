'use client';

import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { ProjectCard } from '@/entities/project';
import { useTheme } from '@/shared/theme';
import { Link } from '@/shared/i18n';
import style from './projects-section.module.scss';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations();
  const { theme } = useTheme();

  return (
    <section id="projects" className={style.projects}>
      <div className="container">
        <div className={style.projects__header}>
          <h1 className={style.projects__main_title}>{t('projects.title')}</h1>
        </div>
        <div className={style.projects__cards}>
          {projects.map((elem) => {
            let themeImage = elem.images.light;
            if (elem.images.dark && theme === 'dark') {
              themeImage = elem.images.dark;
            }
            return (
              <Link href={`/project/${elem.id}`} key={elem.id} className={style.projects__card_wrapper}>
                <ProjectCard title={elem.title} image={themeImage} description={elem.description} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
