import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/_app/providers/theme-provider';
import { useTheme, ThemeScript } from '@/shared/theme';
import { ThemeSwitch } from '@/features/switch-theme';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('Theme management', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'theme=; Path=/; Max-Age=0';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
    vi.restoreAllMocks();
  });

  describe('ThemeProvider and useTheme', () => {
    it('defaults to dark theme when localStorage is empty', () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('toggles theme between dark and light', async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Toggle' });

      // First toggle: dark -> light
      await user.click(button);
      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.cookie).toContain('theme=light');

      // Second toggle: light -> dark
      await user.click(button);
      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.cookie).toContain('theme=dark');
    });

    it('adopts a theme applied by ThemeScript before hydration', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('restores the persisted theme if React replaced <html> without data-theme', () => {
      localStorage.setItem('theme', 'light');

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('handles localStorage throwing SecurityError gracefully and defaults to dark', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalStorage = window.localStorage;
      const storageMock = {
        getItem: vi.fn().mockImplementation(() => {
          throw new DOMException('Storage denied', 'SecurityError');
        }),
        setItem: vi.fn().mockImplementation(() => {
          throw new DOMException('Storage denied', 'SecurityError');
        }),
      };
      Object.defineProperty(window, 'localStorage', {
        value: storageMock,
        writable: true,
        configurable: true,
      });

      try {
        render(
          <ThemeProvider>
            <TestConsumer />
          </ThemeProvider>
        );

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      } finally {
        Object.defineProperty(window, 'localStorage', {
          value: originalStorage,
          writable: true,
          configurable: true,
        });
        consoleErrorSpy.mockRestore();
      }
    });

    it('throws error when useTheme is called outside ThemeProvider', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<TestConsumer />)).toThrow('useTheme must be used within ThemeProvider');
      consoleErrorSpy.mockRestore();
    });
  });

  describe('ThemeScript', () => {
    it('renders script tag containing localStorage theme detection code', () => {
      const { container } = render(<ThemeScript />);
      const script = container.querySelector('script');
      expect(script).toBeInTheDocument();
      expect(script?.innerHTML).toContain("localStorage.getItem('theme')");
      expect(script?.innerHTML).toContain("root.setAttribute('data-theme'");
      expect(script?.innerHTML).toContain('document.cookie');
      expect(script?.innerHTML).not.toContain('Element.prototype');
    });
  });

  describe('ThemeSwitch component', () => {
    it('renders checkbox input with accessible aria-label and toggle state', async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <ThemeSwitch />
        </ThemeProvider>
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Switch to light theme' });
      expect(checkbox).not.toBeChecked();

      // Click to toggle to light
      await user.click(checkbox);

      const lightCheckbox = screen.getByRole('checkbox', { name: 'Switch to dark theme' });
      expect(lightCheckbox).toBeChecked();
    });

    it('renders sun and moon icons', () => {
      render(
        <ThemeProvider>
          <ThemeSwitch />
        </ThemeProvider>
      );

      expect(screen.getByRole('img', { name: 'Sun' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Moon' })).toBeInTheDocument();
    });
  });
});
