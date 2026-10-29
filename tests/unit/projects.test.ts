import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isProjectId, projectIds } from '@/entities/project';
import { getProjects, getProject, ProjectSourceError } from '@/entities/project/index.server';

describe('Project entity & data', () => {
  describe('project IDs', () => {
    it('defines projectIds list', () => {
      expect(projectIds).toEqual(['palma', 'store']);
    });

    it('validates project IDs with isProjectId', () => {
      expect(isProjectId('palma')).toBe(true);
      expect(isProjectId('store')).toBe(true);
      expect(isProjectId('unknown')).toBe(false);
      expect(isProjectId('')).toBe(false);
      expect(isProjectId(null as unknown as string)).toBe(false);
      expect(isProjectId(undefined as unknown as string)).toBe(false);
    });
  });

  describe('getProjects', () => {
    it('returns projects in required order (palma first, store second)', async () => {
      const projects = await getProjects('en');
      expect(projects).toHaveLength(2);
      expect(projects[0].id).toBe('palma');
      expect(projects[1].id).toBe('store');
    });

    it('returns localized content for en, ru, uz', async () => {
      for (const locale of ['en', 'ru', 'uz'] as const) {
        const projects = await getProjects(locale);
        expect(projects).toHaveLength(2);

        for (const project of projects) {
          expect(project.title).toBeTruthy();
          expect(project.tagline).toBeTruthy();
          expect(project.seoDescription.length).toBeLessThanOrEqual(160);
          expect(project.stack.primary.length).toBeGreaterThan(0);
          expect(project.stack.groups.length).toBeGreaterThan(0);
          if (project.links.github) {
            expect(project.links.github).toMatch(/^https:\/\/github\.com\//);
          }
          expect(project.deepDive.length).toBeGreaterThan(0);
          for (const entry of project.deepDive) {
            expect(entry.title).toBeTruthy();
            expect(entry.summary).toBeTruthy();
            expect(entry.details).toBeTruthy();
            expect(entry.icon).toBeTruthy();
          }

          if (project.tryIt) {
            for (const step of project.tryIt) {
              expect(step.text).toBeTruthy();
              if (step.title) {
                expect(step.title.length).toBeLessThanOrEqual(32);
              }
            }
          }
        }

        const store = projects.find((p) => p.id === 'store');
        expect(store?.tryIt).toHaveLength(3);
        const palma = projects.find((p) => p.id === 'palma');
        expect(palma?.tryIt).toHaveLength(3);
      }
    });

    it('throws ProjectSourceError for invalid locale', async () => {
      await expect(getProjects('invalid-locale')).rejects.toThrow(ProjectSourceError);
    });
  });

  describe('getProject', () => {
    it('returns project details for valid ID', async () => {
      const project = await getProject('palma', 'en');
      expect(project).not.toBeNull();
      expect(project?.id).toBe('palma');
      expect(project?.title).toBe('Palma UC');
      expect(project?.links.demo).toBe('https://palma-uc.store/');
    });

    it('uses single images for palma and store', async () => {
      const palma = await getProject('palma', 'en');
      const store = await getProject('store', 'en');

      expect(palma?.images.light).toBeTruthy();
      expect(palma?.images.dark).toBeUndefined();
      expect(palma?.images.mobileDark).toBeUndefined();
      expect(store?.images.dark).toBeUndefined();
      expect(store?.images.mobileDark).toBeUndefined();
    });

    it('fills known palma and store metadata', async () => {
      const palma = await getProject('palma', 'en');
      const store = await getProject('store', 'en');

      expect(palma?.type).toBe('personal');
      expect(palma?.status).toBe('live');
      expect(palma?.period).toEqual({ start: 2026 });
      expect(palma?.role).toBe('solo');

      expect(store?.type).toBe('personal');
      expect(store?.status).toBe('live');
      expect(store?.period).toEqual({ start: 2025, end: 2026 });
      expect(store?.role).toBe('solo');
    });

    it('returns null for non-existent project ID', async () => {
      const project = await getProject('non-existent-id', 'en');
      expect(project).toBeNull();
    });

    it('throws ProjectSourceError for invalid locale', async () => {
      await expect(getProject('palma', 'de')).rejects.toThrow(ProjectSourceError);
    });

    it('preserves literal braces in store deep dive details', async () => {
      for (const locale of ['en', 'ru', 'uz'] as const) {
        const store = await getProject('store', locale);
        expect(store).not.toBeNull();
        const hasBraces = store?.deepDive.some((entry) => entry.details.includes('{ ids, items }'));
        expect(hasBraces).toBe(true);
      }
    });
  });

  describe('Server data isolation', () => {
    it('client barrel index.ts does not export server-only data functions or import server-only', async () => {
      const content = await readFile(resolve(process.cwd(), 'src/entities/project/index.ts'), 'utf8');
      expect(content.includes('getProjects')).toBe(false);
      expect(content.includes('getProject')).toBe(false);
      expect(content.includes('ProjectSourceError')).toBe(false);
      expect(content.includes('server-only')).toBe(false);
      expect(content.includes('isProjectId')).toBe(true);
      expect(content.includes('projectIds')).toBe(true);
      expect(content.includes('ProjectCard')).toBe(true);
    });

    it('server index.server.ts and get-projects.ts declare server-only protection', async () => {
      const serverIndex = await readFile(resolve(process.cwd(), 'src/entities/project/index.server.ts'), 'utf8');
      expect(serverIndex).toMatch(/import ['"]server-only['"];/);
      expect(serverIndex).toMatch(/export \{.*getProject.*\} from/);
      expect(serverIndex).toMatch(/export \{.*getProjects.*\} from/);

      const apiModule = await readFile(resolve(process.cwd(), 'src/entities/project/api/get-projects.ts'), 'utf8');
      expect(apiModule).toMatch(/import ['"]server-only['"];/);
    });
  });
});
