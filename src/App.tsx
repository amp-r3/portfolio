import Background from "./components/Background/Background"
import ContactSection from "./components/ContactSection/ContactSection"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import ProjectsSection from "./components/ProjectsSection/ProjectsSection"
import SkillsSection from "./components/SkillsSection/SkillsSection"
import { SmoothScroll } from "./components/SmoothScroll/SmoothScroll"

const App = () => {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <SmoothScroll>
        <Background />
        <Header />
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </SmoothScroll>
    </main>
  )
}

export default App