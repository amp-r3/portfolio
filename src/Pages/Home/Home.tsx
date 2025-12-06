import ContactSection from "@/components/ContactSection/ContactSection"
import Footer from "@/components/Footer/Footer"
import HeroSection from "@/components/HeroSection/HeroSection"
import ProjectsSection from "@/components/ProjectsList/ProjectsList"
import SkillsSection from "@/components/SkillsSection/SkillsSection"

const Home = () => {
    return (
        <>
            <HeroSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
            <Footer />
        </>
    )
}

export default Home