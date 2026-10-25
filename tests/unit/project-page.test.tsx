import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectPage } from '@/_pages/project';

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

describe('ProjectPage (async page component)', () => {
  it('renders project details for a valid project id', async () => {
    const pageJsx = await ProjectPage({ id: 'weather', locale: 'en' });
    render(pageJsx);

    expect(screen.getByRole('heading', { level: 1, name: 'My Weather App' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Live Demo/i })).toHaveAttribute(
      'href',
      'https://my-pogoda.netlify.app/'
    );
    expect(screen.getByRole('link', { name: /GitHub Repo/i })).toHaveAttribute(
      'href',
      'https://github.com/amp-r3/weather'
    );
  });

  it('renders store project with literal braces in benefit description', async () => {
    const pageJsx = await ProjectPage({ id: 'store', locale: 'en' });
    render(pageJsx);

    expect(screen.getByRole('heading', { level: 1, name: 'Store App' })).toBeInTheDocument();
    expect(
      screen.getByText(/\{ ids, items \}/)
    ).toBeInTheDocument();
  });

  it('calls notFound() for invalid project id', async () => {
    await expect(ProjectPage({ id: 'invalid-id', locale: 'en' })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalled();
  });
});
