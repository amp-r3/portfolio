import { notFound } from 'next/navigation';
import { ProjectPage } from '@/_pages/project';
import { isProjectId } from '@/entities/project';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isProjectId(id)) notFound();
  return <ProjectPage id={id} />;
}
