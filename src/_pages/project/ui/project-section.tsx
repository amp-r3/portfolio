import type { ReactNode } from 'react';
import style from './project-section.module.scss';

interface IProjectSectionProps {
  title: string;
  children: ReactNode;
}

export function ProjectSection({ title, children }: IProjectSectionProps) {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      {children}
    </section>
  );
}
