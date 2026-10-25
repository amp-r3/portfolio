import { HeroSection } from '@/widgets/hero';
import { ServicesSection } from '@/widgets/services';
import { ProjectsSection } from '@/widgets/projects';
import { ContactSection } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { getProjects } from '@/entities/project/index.server';

export async function HomePage({ locale = 'en' }: { locale?: string } = {}) {
  const projects = await getProjects(locale);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </>
  );
}
