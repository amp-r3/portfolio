'use client';

import { useTranslations } from 'next-intl';
import { projectsData, ProjectCard } from '@/entities/project';
import { useTheme } from '@/shared/theme';
import { Link } from '@/shared/i18n';
import style from './projects-section.module.scss';

export function ProjectsSection() {
  const t = useTranslations();
  const { theme } = useTheme();

  return (
    <section id="projects" className={style.projects}>
      <div className="container">
        <div className={style.projects__header}>
          <h1 className={style.projects__main_title}>{t('projects.title')}</h1>
        </div>
        <div className={style.projects__cards}>
          {projectsData.map((elem) => {
            const description = t(elem.descKey);
            let themeImage = elem.image;
            if (elem.darkImage && theme === 'dark') {
              themeImage = elem.darkImage;
            }
            return (
              <Link href={`/project/${elem.id}`} key={elem.id} className={style.projects__card_wrapper}>
                <ProjectCard title={elem.title} image={themeImage} description={description} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
