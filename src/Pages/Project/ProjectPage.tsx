import ProjectDetails from "@/components/ProjectDetails/ProjectDetails"
import { projectsData } from "@/data/projectsData"
import { useEffect } from "react"
import { useParams } from "react-router"

const ProjectPage = () => {
  const { id } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projectsData.find(p => p.id === id)
  if (!project) return <div>Project not found</div>
  return (
    <>
      <ProjectDetails
        project={project}
      />
    </>
  )
}

export default ProjectPage