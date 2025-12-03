import ContactSection from "@/components/ContactSection/ContactSection"
import HeroSection from "@/components/HeroSection/HeroSection"
import ProjectsSection from "@/components/ProjectsSection/ProjectsSection"
import SkillsSection from "@/components/SkillsSection/SkillsSection"

const Home = () => {
    return (
        <>
            <HeroSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
        </>
    )
}

export default Home