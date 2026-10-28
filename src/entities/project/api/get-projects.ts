import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ZodError } from 'zod';
import { isLocale, type Locale } from '@/shared/i18n';
import { isProjectId, type ProjectId } from '../model/project-id';
import {
  projectContentSchema,
  type ProjectContentRaw,
  type ProjectImageValue,
} from '../model/content-schema';
import { resolveProjectIcon, resolveProjectImage } from '../model/asset-map';
import type { Project } from '../model/types';
import { ProjectSourceError } from './project-source-error';

const CONTENT_DIR = resolve(process.cwd(), 'content', 'projects');

let cachedProjects: ProjectContentRaw[] | null = null;

function formatValidationError(fileName: string, error: ZodError, parsedJson?: unknown): string {
  const projectId =
    typeof parsedJson === 'object' &&
    parsedJson !== null &&
    'id' in parsedJson &&
    typeof parsedJson.id === 'string'
      ? parsedJson.id
      : null;
  const label = projectId ? `project "${projectId}" (${fileName})` : `project "${fileName}"`;
  const details = error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `  - ${field}: ${issue.message}`;
    })
    .join('\n');

  return `Validation failed for ${label}:\n${details}`;
}

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
        throw new ProjectSourceError(formatValidationError(fileName, parseResult.error, parsedJson));
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

function resolveImageValue(value: ProjectImageValue): { light: string; dark?: string } {
  if (typeof value === 'string') {
    // A single screenshot is used for both themes.
    return { light: resolveProjectImage(value) };
  }

  return {
    light: resolveProjectImage(value.light),
    dark: resolveProjectImage(value.dark),
  };
}

function mapContentToProject(raw: ProjectContentRaw, locale: Locale): Project {
  try {
    const desktopImage = resolveImageValue(raw.images.desktop);
    const mobileImage = raw.images.mobile ? resolveImageValue(raw.images.mobile) : undefined;

    return {
      id: raw.id as ProjectId,
      order: raw.order,
      type: raw.type,
      status: raw.status,
      period: raw.period,
      role: raw.role,
      title: raw.title[locale],
      tagline: raw.tagline[locale],
      seoDescription: raw.seo.description[locale],
      links: {
        demo: raw.links.live,
        github: raw.links.github,
      },
      images: {
        light: desktopImage.light,
        dark: desktopImage.dark,
        mobileLight: mobileImage?.light,
        mobileDark: mobileImage?.dark,
      },
      stack: {
        primary: [...raw.stack.primary],
        groups: raw.stack.groups.map((group) => ({
          id: group.id,
          items: [...group.items],
        })),
      },
      features: raw.features.map((feature) => ({
        icon: resolveProjectIcon(feature.icon),
        text: feature.text[locale],
      })),
      deepDive: raw.deepDive.map((entry) => ({
        icon: resolveProjectIcon(entry.icon),
        title: entry.title[locale],
        summary: entry.summary[locale],
        details: entry.details[locale],
      })),
      tryIt: raw.tryIt?.map((item) => item.text[locale]),
      limitations: raw.limitations?.map((item) => item.text[locale]),
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
