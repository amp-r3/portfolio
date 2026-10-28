import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import type { Project } from '@/entities/project';
import { ProjectPage } from '@/_pages/project';
import { ProjectDetails } from '@/_pages/project/ui/project-details';

const mockNotFound = vi.fn();

vi.mock(import('next/navigation'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    notFound: () => {
      mockNotFound();
      throw new Error('NEXT_NOT_FOUND');
    },
  };
});

vi.mock(import('@/shared/i18n'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({
      back: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
    }),
  };
});

function renderWithIntl(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {node}
    </NextIntlClientProvider>
  );
}

function getPanel(trigger: HTMLElement): HTMLElement {
  const panelId = trigger.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;

  if (!panel) {
    throw new Error('Accordion panel was not found');
  }

  return panel;
}

const minimalProject: Project = {
  id: 'weather',
  order: 1,
  period: { start: 2025 },
  title: 'My Weather App',
  tagline: 'A short tagline',
  seoDescription: 'A short tagline',
  links: {},
  images: { light: '/weather.png' },
  stack: { primary: ['React'], groups: [{ id: 'core', items: ['React'] }] },
  features: [],
  deepDive: [],
};

describe('ProjectPage (async page component)', () => {
  it('renders project details for a valid project id', async () => {
    const pageJsx = await ProjectPage({ id: 'weather', locale: 'en' });
    renderWithIntl(pageJsx);

    expect(screen.getByRole('heading', { level: 1, name: 'My Weather App' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enMessages.projects.actions.demo })).toHaveAttribute(
      'href',
      'https://my-pogoda.netlify.app/'
    );
    expect(screen.getByRole('link', { name: enMessages.projects.actions.github })).toHaveAttribute(
      'href',
      'https://github.com/amp-r3/weather'
    );
    expect(screen.getByRole('button', { name: enMessages.projects.actions.back })).toBeInTheDocument();
    expect(screen.getAllByAltText('Screenshot of the My Weather App project')).toHaveLength(2);
  });

  it('renders only layer 1 and deep dive for weather (no metadata, features, try it, stack or limitations)', async () => {
    const pageJsx = await ProjectPage({ id: 'weather', locale: 'en' });
    renderWithIntl(pageJsx);

    expect(screen.queryByText(enMessages.projects.labels.type.personal)).not.toBeInTheDocument();
    expect(screen.queryByText(enMessages.projects.labels.role.solo)).not.toBeInTheDocument();
    expect(screen.queryByText(enMessages.projects.labels.status.live)).not.toBeInTheDocument();
    expect(screen.queryByText(/2025/)).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: enMessages.projects.labels.section.features })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: enMessages.projects.labels.section.tryIt })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: enMessages.projects.labels.section.stack })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: enMessages.projects.labels.section.limitations })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.projects.labels.section.deepDive })
    ).toBeInTheDocument();
  });

  it('keeps deep dive entries collapsed and shows summary until expanded', async () => {
    const user = userEvent.setup();
    const pageJsx = await ProjectPage({ id: 'weather', locale: 'en' });
    renderWithIntl(pageJsx);

    const trigger = screen.getByRole('button', { name: /Automatic Geolocation/i });
    const panel = getPanel(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.getAllByText(/The application automatically detects the user's location/i).length
    ).toBeGreaterThan(0);

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders store metadata, features, try it and collapsed layer 3 blocks', async () => {
    const pageJsx = await ProjectPage({ id: 'store', locale: 'en' });
    renderWithIntl(pageJsx);

    expect(screen.getByText(enMessages.projects.labels.type.personal)).toBeInTheDocument();
    expect(screen.getByText(enMessages.projects.labels.role.solo)).toBeInTheDocument();
    expect(screen.getByText('2025 — 2026')).toBeInTheDocument();
    expect(screen.getByText(enMessages.projects.labels.status.live)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.projects.labels.section.features })
    ).toBeInTheDocument();
    expect(screen.getByText('Catalog with search, sorting, filters and pagination')).toBeInTheDocument();
    expect(screen.getByText('Admin panel for orders, products and reviews')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: enMessages.projects.labels.section.tryIt })).toBeInTheDocument();
    expect(
      screen.getByText(/Search, pick a category and change sorting: watch the URL update/i)
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: enMessages.projects.actions.demo })).toHaveLength(2);

    const stackTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.stack,
    });
    const limitationsTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.limitations,
    });

    expect(stackTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(limitationsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens several layer 3 blocks at once and exposes their content', async () => {
    const user = userEvent.setup();
    const pageJsx = await ProjectPage({ id: 'store', locale: 'en' });
    renderWithIntl(pageJsx);

    const stackTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.stack,
    });
    const limitationsTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.limitations,
    });

    await user.click(stackTrigger);
    await user.click(limitationsTrigger);

    expect(stackTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(limitationsTrigger).toHaveAttribute('aria-expanded', 'true');

    const stackPanel = getPanel(stackTrigger);
    const limitationsPanel = getPanel(limitationsTrigger);

    expect(within(stackPanel).getByRole('heading', { name: 'Core' })).toBeInTheDocument();
    expect(within(stackPanel).getByRole('heading', { name: 'Data & state' })).toBeInTheDocument();
    expect(within(stackPanel).getByText('Playwright')).toBeInTheDocument();
    expect(
      within(limitationsPanel).getByText(/No real payments: payment methods are a reference list/i)
    ).toBeInTheDocument();
  });

  it('toggles layer 3 blocks with Enter and Space', async () => {
    const user = userEvent.setup();
    const pageJsx = await ProjectPage({ id: 'store', locale: 'en' });
    renderWithIntl(pageJsx);

    const stackTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.stack,
    });
    const limitationsTrigger = screen.getByRole('button', {
      name: enMessages.projects.labels.section.limitations,
    });

    stackTrigger.focus();
    await user.keyboard('{Enter}');
    expect(stackTrigger).toHaveAttribute('aria-expanded', 'true');

    limitationsTrigger.focus();
    await user.keyboard(' ');
    expect(limitationsTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders store project with literal braces in deep dive summary', async () => {
    const pageJsx = await ProjectPage({ id: 'store', locale: 'en' });
    renderWithIntl(pageJsx);

    expect(screen.getByRole('heading', { level: 1, name: 'Store App' })).toBeInTheDocument();
    expect(screen.getAllByText(/\{ ids, items \}/).length).toBeGreaterThan(0);
  });

  it('formats an ongoing period as "Present"', () => {
    renderWithIntl(<ProjectDetails project={minimalProject} />);

    expect(screen.getByText('2025 — Present')).toBeInTheDocument();
  });

  it('calls notFound() for invalid project id', async () => {
    await expect(ProjectPage({ id: 'invalid-id', locale: 'en' })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalled();
  });
});
