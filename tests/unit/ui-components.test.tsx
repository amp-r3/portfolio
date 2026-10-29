import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { BackButton, Badge, Loader } from '@/shared/ui';
import { BenefitCard, ProjectCard } from '@/entities/project';

const mockBack = vi.fn();

vi.mock('@/shared/i18n', () => ({
  useRouter: () => ({
    back: mockBack,
    push: vi.fn(),
    replace: vi.fn(),
  }),
  Link: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const messages = {
  projects: {
    card: {
      open: 'View project',
      demo: 'View demo',
      github: 'GitHub code',
    },
  },
};

function renderWithIntl(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('Shared UI and Project components', () => {
  describe('BackButton', () => {
    it('renders with default aria-label and triggers router.back on click', async () => {
      const user = userEvent.setup();
      render(<BackButton />);

      const button = screen.getByRole('button', { name: 'Go back' });
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('triggers custom onClick handler when provided', async () => {
      const user = userEvent.setup();
      const customClick = vi.fn();
      render(<BackButton onClick={customClick} ariaLabel="Custom back" />);

      const button = screen.getByRole('button', { name: 'Custom back' });
      await user.click(button);

      expect(customClick).toHaveBeenCalledTimes(1);
      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('renders label and applies custom className', () => {
      const { container } = render(<Badge label="React" className="custom-class" />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Loader', () => {
    it('renders loader container and spinner', () => {
      const { container } = render(<Loader />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BenefitCard', () => {
    it('renders title, description and icon', () => {
      const { container } = render(
        <BenefitCard
          title="Performance"
          description="Optimized bundle size"
          iconSrc="/images/lightning.svg"
        />
      );

      expect(screen.getByRole('heading', { level: 3, name: 'Performance' })).toBeInTheDocument();
      expect(screen.getByText('Optimized bundle size')).toBeInTheDocument();
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/lightning.svg');
    });
  });

  describe('ProjectCard', () => {
    it('renders project card title, description and images', () => {
      renderWithIntl(
        <ProjectCard
          href="/project/weather"
          title="Weather App"
          description="Real-time forecasts"
          image="/images/weather-light.png"
          darkImage="/images/weather-dark.png"
        />
      );

      expect(screen.getByRole('heading', { level: 2, name: 'Weather App' })).toBeInTheDocument();
      expect(screen.getByText('Real-time forecasts')).toBeInTheDocument();
      expect(screen.getByAltText('Screenshot of Weather App')).toBeInTheDocument();
      expect(screen.getByAltText('Screenshot of Weather App (dark)')).toBeInTheDocument();
    });

    it('links only the image to the project page', () => {
      renderWithIntl(
        <ProjectCard
          href="/project/weather"
          title="Weather App"
          description="Real-time forecasts"
          image="/images/weather-light.png"
        />
      );

      const imageLink = screen.getByRole('link', { name: 'View project' });
      expect(imageLink).toHaveAttribute('href', '/project/weather');
      expect(imageLink.querySelector('img')?.getAttribute('src')).toContain('weather-light.png');

      expect(screen.getAllByRole('link')).toHaveLength(1);
    });

    it('renders demo and GitHub actions as external links', () => {
      renderWithIntl(
        <ProjectCard
          href="/project/weather"
          title="Weather App"
          description="Real-time forecasts"
          image="/images/weather-light.png"
          demo="https://demo.example.com"
          github="https://github.com/example/weather"
        />
      );

      const demoLink = screen.getByRole('link', { name: 'View demo' });
      expect(demoLink).toHaveAttribute('href', 'https://demo.example.com');
      expect(demoLink).toHaveAttribute('target', '_blank');
      expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');

      const githubLink = screen.getByRole('link', { name: 'GitHub code' });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/example/weather');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
