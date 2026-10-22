import { notFound } from 'next/navigation';
import { isProjectId, projectIds } from '@/entities/project';
import { ProjectPage } from '@/_pages/project';

export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isProjectId(id)) notFound();

  return {};
}

export default async function Page({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  return <ProjectPage id={id} locale={locale} />;
}
