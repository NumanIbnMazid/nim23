import React from "react"
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"
import { ProjectType } from "@lib/types"
import { useEffect, useState } from "react"
import { getAllProjects } from "@lib/backendAPI"
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'
import dynamic from 'next/dynamic'

const ProjectSection = dynamic(() => import('@components/ProjectSection'), {
  loading: () => <Loader />,
})


export default function Projects() {
  const [isLoading, setIsLoading] = useState(true)

  const [projects, setProjects] = useState<ProjectType[]>([])

  const fetchProjects = async () => {
    const projectsData: ProjectType[] = await getAllProjects()
    setProjects(projectsData)
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProjects()
      ]);
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <>
      <Metadata
        title="Projects"
        description={pageMeta.projects.description}
        previewImage={pageMeta.projects.image}
        keywords={pageMeta.projects.keywords}
      />
      {isLoading ? (
        <Loader />
      ) : projects.length > 0 ? (
        <div className="relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
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
      ) : (
        <NoData />
      )}
      
    </>
  )
}
