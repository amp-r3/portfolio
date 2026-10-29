import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { BackButton, Badge, Loader } from '@/shared/ui';
import { ProjectCard } from '@/entities/project';

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
      details: 'Details',
      demo: 'View demo',
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

    it('links the image, title, and details button to the project page', () => {
      renderWithIntl(
        <ProjectCard
          href="/project/weather"
          title="Weather App"
          description="Real-time forecasts"
          image="/images/weather-light.png"
        />
      );

      const titleLink = screen.getByRole('link', { name: 'Weather App' });
      expect(titleLink).toHaveAttribute('href', '/project/weather');

      const detailsLink = screen.getByRole('link', { name: 'Details' });
      expect(detailsLink).toHaveAttribute('href', '/project/weather');

      const imageLink = screen.getByAltText('Screenshot of Weather App').closest('a');
      expect(imageLink).toHaveAttribute('href', '/project/weather');

      expect(screen.getAllByRole('link')).toHaveLength(3);
    });

    it('renders demo action as external link without github action', () => {
      renderWithIntl(
        <ProjectCard
          href="/project/weather"
          title="Weather App"
          description="Real-time forecasts"
          image="/images/weather-light.png"
          demo="https://demo.example.com"
        />
      );

      const demoLink = screen.getByRole('link', { name: 'View demo' });
      expect(demoLink).toHaveAttribute('href', 'https://demo.example.com');
      expect(demoLink).toHaveAttribute('target', '_blank');
      expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');

      expect(screen.queryByText('GitHub code')).not.toBeInTheDocument();
    });
  });
});
