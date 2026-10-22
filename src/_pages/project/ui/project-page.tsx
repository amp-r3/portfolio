import { notFound } from 'next/navigation';
import { isProjectId, projectsData } from '@/entities/project';
import { ProjectDetails } from './project-details';

export function ProjectPage({ id }: { id: string }) {
  if (!isProjectId(id)) notFound();

  const project = projectsData.find((item) => item.id === id);

  if (!project) notFound();

  return <ProjectDetails project={project} />;
}
