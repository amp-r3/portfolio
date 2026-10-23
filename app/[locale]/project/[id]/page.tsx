import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isProjectId, projectIds } from '@/entities/project';
import { getProject } from '@/entities/project/index.server';
import { ProjectPage } from '@/_pages/project';

export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;

  if (!isProjectId(id)) notFound();

  const project = await getProject(id, locale);
  if (!project) notFound();

  const title = project.title;
  const description = project.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/project/${id}`,
      languages: {
        en: `/en/project/${id}`,
        ru: `/ru/project/${id}`,
        uz: `/uz/project/${id}`,
      },
    },
    openGraph: {
      title: `${title} | Amir Ergashev`,
      description,
      type: 'article',
      url: `https://amp3re.netlify.app/${locale}/project/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Amir Ergashev`,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  return <ProjectPage id={id} locale={locale} />;
}
