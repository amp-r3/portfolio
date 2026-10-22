import { HeroSection } from '@/widgets/hero';
import { SkillsSection } from '@/widgets/skills';
import { ProjectsSection } from '@/widgets/projects';
import { ContactSection } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { getProjects } from '@/entities/project/index.server';

export async function HomePage({ locale = 'en' }: { locale?: string } = {}) {
  const projects = await getProjects(locale);

  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </>
  );
}
