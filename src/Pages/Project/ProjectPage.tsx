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
  let themeImage = project.image;
  if (project.darkImage && theme === 'dark') {
    themeImage = project.darkImage
  }
  return (
    <>
      <ProjectDetails
        title={project.title}
        desc={description}
        img={themeImage}
        tools={project.tools}
        demoLink={project.demoLink}
        githubLink={project.githubLink}
      />
    </>
  )
}

export default ProjectPage