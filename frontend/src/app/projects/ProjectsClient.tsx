'use client' // ✅ Mark as a Client Component

import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'
import { ProjectType } from '@/lib/types' // ✅ Import correct type

const ProjectSection = dynamic(() => import('@/components/ProjectSection'), {
  loading: () => <Loader />,
})

export default function ProjectsClient({ initialProjects }: { initialProjects: ProjectType[] }) {
  return (
    <>
      {initialProjects && initialProjects.length > 0 ? (
        <div className="relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="grid min-h-screen py-20 place-content-center"
          >
            <div>
              <ProjectSection projects={initialProjects} />
            </div>
          </motion.section>
        </div>
      ) : (
        <div className="mt-16">
          <NoData />
        </div>
      )}
    </>
  )
}
