import ProjectDetails from "@/components/ProjectDetails/ProjectDetails"
import { projectsData } from "@/data/projectsData"
import { useTheme } from "@/hooks/useTheme"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"

const ProjectPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { theme } = useTheme()
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
        link={project.link}
      />
    </>
  )
}

export default ProjectPage