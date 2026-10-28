import { describe, it, expect } from 'vitest';
import { projectContentSchema } from '@/entities/project/model/content-schema';

const localized = (value: string) => ({ en: value, ru: value, uz: value });

function createProject(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test',
    order: 1,
    title: localized('Test project'),
    tagline: localized('A test project tagline'),
    seo: { description: localized('A test project SEO description') },
    links: { live: 'https://example.com', github: 'https://github.com/example/test' },
    images: { desktop: { light: 'weatherLight', dark: 'weatherDark' } },
    stack: {
      primary: ['React'],
      groups: [{ id: 'core', items: ['React', 'TypeScript'] }],
    },
    features: [],
    deepDive: [],
    ...overrides,
  };
}

function issuePaths(input: unknown): string[] {
  const result = projectContentSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join('.'));
}

describe('project content schema', () => {
  it('accepts a valid project with string or theme-aware images', () => {
    expect(projectContentSchema.safeParse(createProject()).success).toBe(true);
    expect(
      projectContentSchema.safeParse({
        ...createProject(),
        images: { desktop: 'storeDark', mobile: 'storeMobileDark' },
      }).success
    ).toBe(true);
  });

  it('requires all three locales', () => {
    const project = createProject({
      title: { en: 'Test project', uz: 'Test project' },
    });

    expect(issuePaths(project)).toContain('title.ru');
  });

  it('rejects empty localized strings', () => {
    const project = createProject({
      tagline: { en: 'Tagline', ru: '', uz: 'Tagline' },
    });

    expect(issuePaths(project)).toContain('tagline.ru');
  });

  it('limits SEO descriptions to 160 characters', () => {
    const project = createProject({
      seo: { description: localized('x'.repeat(161)) },
    });

    expect(issuePaths(project)).toContain('seo.description.en');
  });

  it('rejects icons outside the project registry', () => {
    const project = createProject({
      features: [{ icon: 'not-a-real-icon', text: localized('Feature') }],
    });

    expect(issuePaths(project)).toContain('features.0.icon');
  });

  it('requires every primary stack item to exist in stack.groups', () => {
    const project = createProject({
      stack: {
        primary: ['React', 'Missing'],
        groups: [{ id: 'core', items: ['React'] }],
      },
    });

    expect(issuePaths(project)).toContain('stack.primary');
  });

  it('enforces list limits', () => {
    const project = createProject({
      features: Array.from({ length: 7 }, () => ({
        icon: 'server',
        text: localized('Feature'),
      })),
      deepDive: Array.from({ length: 6 }, () => ({
        icon: 'server',
        title: localized('Title'),
        summary: localized('Summary'),
        details: localized('Details'),
      })),
      tryIt: Array.from({ length: 4 }, () => ({ text: localized('Try it') })),
      limitations: Array.from({ length: 5 }, () => ({ text: localized('Limit') })),
    });

    const paths = issuePaths(project);
    expect(paths).toContain('features');
    expect(paths).toContain('deepDive');
    expect(paths).toContain('tryIt');
    expect(paths).toContain('limitations');
  });

  it('validates tryIt step titles when present', () => {
    const validWithTitle = createProject({
      tryIt: [
        {
          title: localized('Filters and URL'),
          text: localized('Search, pick a category and sort'),
        },
        {
          text: localized('Step without title'),
        },
      ],
    });
    expect(projectContentSchema.safeParse(validWithTitle).success).toBe(true);

    const tooLongTitle = createProject({
      tryIt: [
        {
          title: localized('x'.repeat(33)),
          text: localized('Text'),
        },
      ],
    });
    expect(issuePaths(tooLongTitle)).toContain('tryIt.0.title.en');

    const missingLocaleTitle = createProject({
      tryIt: [
        {
          title: { en: 'Title', ru: 'Заголовок' } as unknown as { en: string; ru: string; uz: string },
          text: localized('Text'),
        },
      ],
    });
    expect(issuePaths(missingLocaleTitle)).toContain('tryIt.0.title.uz');

    const emptyTitle = createProject({
      tryIt: [
        {
          title: { en: '', ru: 'Заголовок', uz: 'Sarlavha' },
          text: localized('Text'),
        },
      ],
    });
    expect(issuePaths(emptyTitle)).toContain('tryIt.0.title.en');
  });
});
