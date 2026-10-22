import { notFound } from 'next/navigation';
import { getProject } from '@/entities/project/index.server';
import { isProjectId } from '@/entities/project';
import { ProjectDetails } from './project-details';

interface ProjectPageProps {
  id: string;
  locale: string;
}

export async function ProjectPage({ id, locale }: ProjectPageProps) {
  if (!isProjectId(id)) {
    notFound();
  }

  const project = await getProject(id, locale);

  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}
