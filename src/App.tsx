import ContactSection from "./components/ContactSection/ContactSection"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import ProjectsSection from "./components/ProjectsSection/ProjectsSection"
import SkillsSection from "./components/SkillsSection/SkillsSection"

const App = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </>
  )
}

export default App