import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/_app/providers/theme-provider';
import { Header } from '@/widgets/header';
import { NotFoundPage } from '@/_pages/not-found';
import { ErrorPage } from '@/_pages/error';

const mockBack = vi.fn();
const mockPush = vi.fn();
let mockPathname = '/';

vi.mock('@/shared/i18n', () => ({
  getPathname: ({ href, locale }: { href: string; locale: string }) =>
    `/${locale}${href === '/' ? '' : href}`,
  usePathname: () => mockPathname,
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: vi.fn(),
  }),
  useLocale: () => 'en',
  useI18n: () => null,
  useSetNotFound: () => {},
  routing: { locales: ['en', 'ru', 'uz'], defaultLocale: 'en' },
  Link: ({ children, href, className, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

import enMessages from '../../messages/en.json';

function renderWithProviders(component: React.ReactNode) {
  return render(
    <ThemeProvider>
      <NextIntlClientProvider locale="en" messages={enMessages}>
        {component}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

describe('Widgets and Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/';
  });

  describe('Header widget', () => {
    it('renders navigation links and theme/language controls', () => {
      renderWithProviders(<Header />);

      expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /Switch to (light|dark) theme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Change language' })).toBeInTheDocument();
    });

    it('links to home anchors from project pages', async () => {
      mockPathname = '/project/weather';
      const user = userEvent.setup();
      renderWithProviders(<Header />);

      const servicesLink = screen.getByRole('link', { name: 'Skills' });
      expect(servicesLink).toHaveAttribute('href', '/en/#services');

      await user.click(servicesLink);

      expect(mockPush).toHaveBeenCalledWith('/#services');
    });

    it('toggles mobile menu on button click', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Header />);

      const svgIcon = container.querySelector('svg line');
      const menuButton = svgIcon?.closest('button');
      expect(menuButton).toBeInTheDocument();

      const menuList = container.querySelector('ul');
      expect(menuList).not.toHaveClass('active');

      await user.click(menuButton!);
      expect(menuList).toHaveClass('active');

      await user.click(menuButton!);
      expect(menuList).not.toHaveClass('active');
    });
  });

  describe('NotFoundPage', () => {
    it('renders 404 heading and return home link', () => {
      renderWithProviders(<NotFoundPage />);

      expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
      expect(screen.getByText('undefined')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Return to Homepage' })).toHaveAttribute('href', '/');
    });

    it('triggers router.back when clicking Go Back button', async () => {
      const user = userEvent.setup();
      renderWithProviders(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: 'Go Back' });
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorPage', () => {
    it('renders 500 error heading and message', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithProviders(<ErrorPage error={new Error('Test error')} />);

      expect(screen.getByRole('heading', { level: 1, name: '500' })).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('An unexpected error occurred while processing this request.')).toBeInTheDocument();
      consoleErrorSpy.mockRestore();
    });

    it('invokes reset handler when clicking Try Again', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const resetMock = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<ErrorPage error={new Error('Crash')} reset={resetMock} />);

      const retryButton = screen.getByRole('button', { name: 'Try Again' });
      await user.click(retryButton);

      expect(resetMock).toHaveBeenCalledTimes(1);
      consoleErrorSpy.mockRestore();
    });
  });
});
