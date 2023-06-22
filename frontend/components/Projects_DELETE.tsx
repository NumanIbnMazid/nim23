import { FadeContainer } from "../content/FramerMotionVariants"
import { HomeHeading } from "../pages"
import { motion } from "framer-motion"
import React from "react"
import { useEffect, useState } from 'react'
import { getAllProjects } from "@lib/backendAPI"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import Project from "@components/ProjectSection"
import { ProjectType } from "@lib/types"


export default function ProjectSection() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const projectsData = await getAllProjects()
    setProjects(projectsData)
  }

  // ******* Loader Starts *******
  if (projects.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Projects" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p>
            I've been making various types of projects some of them were basics
            and some of them were complicated. So far I've made{" "}
            <span className="font-bold text-gray-600 dark:text-gray-200">
              {projects.length}+
            </span>{" "}
            projects.
          </p>
          <AnimatedDiv
            variants={FadeContainer}
            className="grid grid-cols-1 gap-4 mx-auto md:ml-[20%] xl:ml-[24%]"
          >
            {projects.map((project: ProjectType) => {
              if (project.name === "" && project.githubURL === "") return null;
              return <Project key={project.id} project={project} />;
            })}
          </AnimatedDiv>
        </div>
      </motion.div>
    </section>
  )
}
