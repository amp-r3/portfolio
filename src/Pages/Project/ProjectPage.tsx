import ProjectDetails from "@/components/ProjectDetails/ProjectDetails"
import { projectsData } from "@/data/projectsData"
import { useTheme } from "@/hooks/useTheme"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"

const ProjectPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { theme } = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projectsData.find(p => p.id === id)
  if (!project) return <div>Project not found</div>
  const description = t(project.descKey)

  const { image, darkImage, mobileImage, mobileDarkImage } = project;

  const themeImage = theme === 'dark'
    ? (darkImage ?? image ?? null)
    : (image ?? null);

  const mobileThemeImage = theme === 'dark'
    ? (mobileDarkImage ?? mobileImage ?? darkImage ?? image ?? null)
    : (mobileImage ?? image ?? null);

    
  return (
    <>
      <ProjectDetails
        title={project.title}
        desc={description}
        img={themeImage}
        mobileImg={mobileThemeImage}
        tools={project.tools}
        demoLink={project.demoLink}
        githubLink={project.githubLink}
        benefits={project.benefits}
      />
    </>
  )
}

export default ProjectPage