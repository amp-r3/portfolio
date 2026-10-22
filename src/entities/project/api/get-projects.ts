import 'server-only';
import { createTranslator } from 'next-intl';
import { isLocale, type Locale } from '@/shared/i18n';
import { isProjectId } from '../model/project-id';
import { rawProjects, type RawProject } from '../model/raw-projects';
import type { Project, ProjectBenefit } from '../model/types';
import { ProjectSourceError } from './project-source-error';

async function loadLocaleMessages(locale: string): Promise<Record<string, unknown>> {
  if (!isLocale(locale)) {
    throw new ProjectSourceError(`Unsupported or invalid locale: "${locale}"`);
  }

  try {
    const messagesModule = await import(`../../../../messages/${locale}.json`);
    const messages = messagesModule.default ?? messagesModule;
    if (!messages || typeof messages !== 'object') {
      throw new Error(`Invalid messages structure for locale "${locale}"`);
    }
    return messages as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ProjectSourceError) throw error;
    throw new ProjectSourceError(`Failed to load messages for locale "${locale}"`, { cause: error });
  }
}

function mapRawProjectToProject(raw: RawProject, locale: Locale, messages: Record<string, unknown>): Project {
  try {
    const t = createTranslator({
      locale,
      messages,
      onError(error) {
        throw error;
      },
    }) as unknown as (key: string) => string;

    const description = t(raw.descKey);
    const benefits: ProjectBenefit[] = raw.benefits.map((benefit) => ({
      title: t(benefit.titleKey),
      description: t(benefit.descKey),
      icon: benefit.icon,
    }));

    return {
      id: raw.id,
      title: raw.title,
      description,
      tools: [...raw.tools],
      links: {
        demo: raw.demoLink,
        github: raw.githubLink,
      },
      images: {
        light: raw.images.light,
        dark: raw.images.dark,
        mobileLight: raw.images.mobileLight,
        mobileDark: raw.images.mobileDark,
      },
      benefits,
      demoLink: raw.demoLink,
      githubLink: raw.githubLink,
      image: raw.images.light,
      darkImage: raw.images.dark,
      mobileImage: raw.images.mobileLight,
      mobileDarkImage: raw.images.mobileDark,
    };
  } catch (error) {
    throw new ProjectSourceError(`Failed to map project "${raw.id}" for locale "${locale}"`, { cause: error });
  }
}

export async function getProjects(locale: string = 'en'): Promise<Project[]> {
  const messages = await loadLocaleMessages(locale);
  const resolvedLocale = locale as Locale;

  return rawProjects.map((raw) => mapRawProjectToProject(raw, resolvedLocale, messages));
}

export async function getProject(id: string, locale: string = 'en'): Promise<Project | null> {
  if (!isProjectId(id)) {
    return null;
  }

  const raw = rawProjects.find((item) => item.id === id);
  if (!raw) {
    return null;
  }

  const messages = await loadLocaleMessages(locale);
  const resolvedLocale = locale as Locale;

  return mapRawProjectToProject(raw, resolvedLocale, messages);
}
