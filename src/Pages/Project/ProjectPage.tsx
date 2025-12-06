import ProjectDetails from "@/components/ProjectDetails/ProjectDetails"
import { projectsData } from "@/data/projectsData"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"

const ProjectPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const project = projectsData.find(p => p.id === id)
  if (!project) return <div>Project not found</div>
  const description = t(project.descKey)
  return (
    <>
      <ProjectDetails
        title={project.title}
        desc={description}
        img={project.image}
        tools={project.tools}

      />
    </>
  )
}

export default ProjectPage