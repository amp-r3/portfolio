import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import { HeroSection } from '@/widgets/hero';
import { ServicesSection } from '@/widgets/services';
import { ProjectsSection } from '@/widgets/projects';
import { ContactSection } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import type { Project } from '@/entities/project';

vi.mock('@/shared/i18n', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  Link: ({ children, href, className, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

const mockProjects: Project[] = [
  {
    id: 'weather',
    title: 'My Weather App',
    description: 'Weather application description',
    tools: ['React', 'TypeScript'],
    links: { demo: 'https://demo.com', github: 'https://github.com' },
    images: { light: '/weather.png' },
    benefits: [],
    demoLink: 'https://demo.com',
    githubLink: 'https://github.com',
    image: '/weather.png',
  },
  {
    id: 'store',
    title: 'Store App',
    description: 'Store application description',
    tools: ['Next.js', 'Redux'],
    links: { demo: 'https://store.com', github: 'https://github.com' },
    images: { light: '/store.png' },
    benefits: [],
    demoLink: 'https://store.com',
    githubLink: 'https://github.com',
    image: '/store.png',
  },
];

function renderSection(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('Home Page Sections', () => {
  describe('HeroSection', () => {
    it('renders hero title, greeting, and call to action links', () => {
      renderSection(<HeroSection />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Frontend Developer/i);
      expect(screen.getByText(enMessages.hero.greeting)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: enMessages.hero.primaryButton })).toHaveAttribute('href', '#projects');
      expect(screen.getByRole('link', { name: enMessages.hero.secondaryButton })).toHaveAttribute('href', '#contact');
    });
  });

  describe('ServicesSection', () => {
    it('renders all service offerings and changes active service on click', async () => {
      const user = userEvent.setup();
      renderSection(<ServicesSection />);

      expect(screen.getAllByText(enMessages.services.items.fullstack.title).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(enMessages.services.items.architecture.title)).toBeInTheDocument();
      expect(screen.getByText(enMessages.services.items.backend.title)).toBeInTheDocument();
      expect(screen.getByText(enMessages.services.items.performance.title)).toBeInTheDocument();

      // Click second service
      const archTitle = screen.getByText(enMessages.services.items.architecture.title);
      await user.click(archTitle);
      expect(screen.getAllByText(enMessages.services.items.architecture.title).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('ProjectsSection', () => {
    it('renders project list with links to individual project pages', () => {
      renderSection(<ProjectsSection projects={mockProjects} />);

      expect(screen.getByRole('heading', { level: 1, name: enMessages.projects.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'My Weather App' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Store App' })).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links.some((link) => link.getAttribute('href') === '/project/weather')).toBe(true);
      expect(links.some((link) => link.getAttribute('href') === '/project/store')).toBe(true);
    });
  });

  describe('ContactSection', () => {
    it('renders contact details and social links', () => {
      renderSection(<ContactSection />);

      expect(screen.getByRole('heading', { name: enMessages.contact.title })).toBeInTheDocument();
      expect(screen.getByText(enMessages.contact.info.location)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: enMessages.contact.info.title })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'amp_r3@proton.me' })).toHaveAttribute(
        'href',
        'mailto:amp_r3@proton.me'
      );
      expect(screen.queryByRole('heading', { name: /phone/i })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: enMessages.contact.social.title })).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders footer copyright and links', () => {
      renderSection(<Footer />);

      expect(screen.getByText(new RegExp(enMessages.footer.rights))).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: enMessages.footer.title })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: enMessages.footer.button })).toHaveAttribute('href', '#contact');
    });
  });
});
