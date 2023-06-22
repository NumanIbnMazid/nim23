import React from "react"
import ProjectSection from "@components/ProjectSection"
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"
import { ProjectType } from "@lib/types"
import { useEffect, useState } from "react"
import { getAllProjects } from "@lib/backendAPI"



export default function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([])

  const fetchProjects = async () => {
    const projectsData: ProjectType[] = await getAllProjects()
    setProjects(projectsData)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <>
      <div className="relative max-w-4xl mx-auto dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-20 place-content-center"
        >
          <div>
            <ProjectSection projects={projects} />
          </div>
        </motion.section>
      </div>
    </>
  )
}
