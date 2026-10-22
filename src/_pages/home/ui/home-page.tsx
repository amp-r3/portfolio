import { HeroSection } from '@/widgets/hero';
import { SkillsSection } from '@/widgets/skills';
import { ProjectsSection } from '@/widgets/projects';
import { ContactSection } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
