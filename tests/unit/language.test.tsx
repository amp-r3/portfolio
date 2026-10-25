import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routing, isLocale } from '@/shared/i18n';
import { LanguageSwitch } from '@/features/switch-language';
import { I18nProvider } from '@/shared/i18n/context';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('@/shared/i18n/navigation', () => ({
  usePathname: () => '/project/weather',
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
  }),
  Link: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('Language & Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('routing config & isLocale', () => {
    it('defines expected locales and default locale', () => {
      expect(routing.locales).toEqual(['en', 'ru', 'uz']);
      expect(routing.defaultLocale).toBe('en');
    });

    it('validates locale correctly with isLocale', () => {
      expect(isLocale('en')).toBe(true);
      expect(isLocale('ru')).toBe(true);
      expect(isLocale('uz')).toBe(true);
      expect(isLocale('fr')).toBe(false);
      expect(isLocale(undefined)).toBe(false);
    });
  });

  describe('LanguageSwitch component', () => {
    const dummyMessages = {
      en: {},
      ru: {},
      uz: {},
    };

    it('renders current locale in button', () => {
      render(
        <I18nProvider initialLocale="en" messages={dummyMessages}>
          <LanguageSwitch />
        </I18nProvider>
      );

      const button = screen.getByRole('button', { name: 'Change language' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('EN');
    });

    it('cycles from en to ru on click', async () => {
      const user = userEvent.setup();
      render(
        <I18nProvider initialLocale="en" messages={dummyMessages}>
          <LanguageSwitch />
        </I18nProvider>
      );

      const button = screen.getByRole('button', { name: 'Change language' });
      await user.click(button);

      expect(mockReplace).toHaveBeenCalledWith('/project/weather', {
        locale: 'ru',
        scroll: false,
      });
    });

    it('cycles from ru to uz on click', async () => {
      const user = userEvent.setup();
      render(
        <I18nProvider initialLocale="ru" messages={dummyMessages}>
          <LanguageSwitch />
        </I18nProvider>
      );

      const button = screen.getByRole('button', { name: 'Change language' });
      await user.click(button);

      expect(mockReplace).toHaveBeenCalledWith('/project/weather', {
        locale: 'uz',
        scroll: false,
      });
    });

    it('cycles from uz to en on click', async () => {
      const user = userEvent.setup();
      render(
        <I18nProvider initialLocale="uz" messages={dummyMessages}>
          <LanguageSwitch />
        </I18nProvider>
      );

      const button = screen.getByRole('button', { name: 'Change language' });
      await user.click(button);

      expect(mockReplace).toHaveBeenCalledWith('/project/weather', {
        locale: 'en',
        scroll: false,
      });
    });
  });
});
