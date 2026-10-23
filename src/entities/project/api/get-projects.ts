import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isLocale, type Locale } from '@/shared/i18n';
import { isProjectId, type ProjectId } from '../model/project-id';
import { projectContentSchema, type ProjectContentRaw } from '../model/content-schema';
import { resolveProjectIcon, resolveProjectImage } from '../model/asset-map';
import type { Project, ProjectBenefit } from '../model/types';
import { ProjectSourceError } from './project-source-error';

const CONTENT_DIR = resolve(process.cwd(), 'content', 'projects');

let cachedProjects: ProjectContentRaw[] | null = null;

async function loadAllProjectFiles(): Promise<ProjectContentRaw[]> {
  if (cachedProjects) {
    return cachedProjects;
  }

  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
    const jsonFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => entry.name);

    if (jsonFiles.length === 0) {
      throw new ProjectSourceError(`No project files found in content directory: "${CONTENT_DIR}"`);
    }

    const loaded: ProjectContentRaw[] = [];

    for (const fileName of jsonFiles) {
      const fullPath = resolve(CONTENT_DIR, fileName);
      let rawContent: string;
      try {
        rawContent = await readFile(fullPath, 'utf8');
      } catch (readError) {
        throw new ProjectSourceError(`Failed to read project file "${fileName}"`, { cause: readError });
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(rawContent);
      } catch (parseError) {
        throw new ProjectSourceError(`Invalid JSON in project file "${fileName}"`, { cause: parseError });
      }

      const parseResult = projectContentSchema.safeParse(parsedJson);
      if (!parseResult.success) {
        throw new ProjectSourceError(
          `Validation failed for "${fileName}": ${parseResult.error.message}`
        );
      }

      loaded.push(parseResult.data);
    }

    loaded.sort((a, b) => a.order - b.order);
    cachedProjects = loaded;
    return loaded;
  } catch (error) {
    if (error instanceof ProjectSourceError) throw error;
    throw new ProjectSourceError('Failed to read projects from content directory', { cause: error });
  }
}

function mapContentToProject(raw: ProjectContentRaw, locale: Locale): Project {
  try {
    const title = typeof raw.title === 'string' ? raw.title : raw.title[locale];
    const description = raw.description[locale];

    const benefits: ProjectBenefit[] = raw.benefits.map((b) => ({
      title: b.title[locale],
      description: b.description[locale],
      icon: resolveProjectIcon(b.icon),
    }));

    const lightImage = resolveProjectImage(raw.images.light);
    const darkImage = raw.images.dark ? resolveProjectImage(raw.images.dark) : undefined;
    const mobileLightImage = raw.images.mobileLight ? resolveProjectImage(raw.images.mobileLight) : undefined;
    const mobileDarkImage = raw.images.mobileDark ? resolveProjectImage(raw.images.mobileDark) : undefined;

    return {
      id: raw.id as ProjectId,
      title,
      description,
      tools: [...raw.technologies],
      links: {
        demo: raw.links.live,
        github: raw.links.github,
      },
      images: {
        light: lightImage,
        dark: darkImage,
        mobileLight: mobileLightImage,
        mobileDark: mobileDarkImage,
      },
      benefits,
      demoLink: raw.links.live,
      githubLink: raw.links.github,
      image: lightImage,
      darkImage,
      mobileImage: mobileLightImage,
      mobileDarkImage,
    };
  } catch (error) {
    if (error instanceof ProjectSourceError) throw error;
    throw new ProjectSourceError(`Failed to map project "${raw.id}" for locale "${locale}"`, { cause: error });
  }
}

export async function getProjects(locale: string = 'en'): Promise<Project[]> {
  if (!isLocale(locale)) {
    throw new ProjectSourceError(`Unsupported or invalid locale: "${locale}"`);
  }
  const allRaw = await loadAllProjectFiles();
  return allRaw.map((raw) => mapContentToProject(raw, locale));
}

export async function getProject(id: string, locale: string = 'en'): Promise<Project | null> {
  if (!isProjectId(id)) {
    return null;
  }
  if (!isLocale(locale)) {
    throw new ProjectSourceError(`Unsupported or invalid locale: "${locale}"`);
  }
  const allRaw = await loadAllProjectFiles();
  const raw = allRaw.find((item) => item.id === id);
  if (!raw) {
    return null;
  }
  return mapContentToProject(raw, locale);
}
