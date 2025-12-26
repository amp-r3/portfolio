import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary"
import ProjectDetails from "@/components/ProjectDetails/ProjectDetails"
import { projectsData } from "@/data/projectsData"
import { useParams } from "react-router"

const ProjectPage = () => {
  const { id } = useParams()

  const project = projectsData.find(p => p.id === id)
  if (!project) return <ErrorBoundary />
  return (
    <>
      <ProjectDetails
        project={project}
      />
    </>
  )
}

export default ProjectPage