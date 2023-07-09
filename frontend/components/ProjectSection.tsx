import { BsGithub } from 'react-icons/bs'
import { MdOutlineLink } from 'react-icons/md'
import Link from 'next/link'
import OgImage from '@components/OgImage'
import { ProjectType } from '@lib/types'
import { motion } from 'framer-motion'
import { popUp } from '../content/FramerMotionVariants'
import { FadeContainer } from '../content/FramerMotionVariants'
import React from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import AnimatedHeading from "@components/FramerMotion/AnimatedHeading"
import { headingFromLeft } from "@content/FramerMotionVariants"


export default function ProjectSection({ projects }: { projects: ProjectType[] }) {
  // ******* Loader Starts *******
  if (projects.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <div>
        <AnimatedHeading
          className="w-full my-2 text-3xl font-bold text-left font-inter flex justify-center items-center"
          variants={headingFromLeft}
        >
          <span className="mr-2">Projects</span>
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
            {projects.length}
          </span>
        </AnimatedHeading>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p className="mb-12">
            I believe that projects are not just tasks to be completed, but opportunities to bring ideas to life, solve problems, and make a meaningful impact.
            In each project, I follow a meticulous approach, combining innovative thinking, strategic planning, and attention to detail.
            Here I will showcase some of the exciting projects I have worked on.
          </p>
          <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 gap-4 mx-auto md:ml-[20%] xl:ml-[24%]">
            {projects.map((project: ProjectType, index) => (
              <motion.div
                key={index}
                variants={popUp}
                className="flex items-center justify-center gap-4 p-4 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
              >
                <div className="card">
                  {project.image !== null && (
                    <OgImage src={project?.image} alt={project.title} />
                  )}
                  <div className="flex flex-col justify-start gap-3">
                    <Link
                      href={`projects/${project.slug}`}
                      title="View Project Details"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black dark:hover:text-white hover:underline">
                        <h1 className="font-bold text-neutral-900 dark:text-neutral-200 text-xl">
                          {project.title}
                        </h1>
                    </Link>

                    <h2 className="text-neutral-900 dark:text-neutral-200 text-sm">
                      {project.short_description}
                    </h2>

                    <p className="p-0 m-0 text-sm text-gray-500">
                      <span className="font-bold">
                        {project.duration}
                        <span className="font-light text-xs ml-2">({project.duration_in_days})</span>
                      </span>
                    </p>

                    {project.description && (
                    <div
                      className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-5"
                      dangerouslySetInnerHTML={{ __html: project.description || '' }}
                    ></div>
                    )}


                    {project.technology && (
                    <div className="flex flex-wrap items-center gap-1">
                      {project.technology.split(',').map((technology, index) => {
                        return (
                          <span
                            key={`${technology}-${index}`}
                            className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded dark:bg-darkPrimary"
                          >
                            {technology}
                          </span>
                        )
                      })}
                    </div>
                    )}

                    <div className="flex items-center gap-4 p-2 mt-auto w-fit">
                      {project.github_url && (
                        <Link
                          href={project.github_url}
                          title="Source Code on GitHub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <BsGithub className="w-6 h-6 transition-all hover:scale-110 active:scale-90" />
                        </Link>
                      )}

                      {project.preview_url && (
                        <Link
                          href={project.preview_url}
                          title="Live Preview"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <MdOutlineLink className="w-6 h-6 transition-all hover:scale-110 active:scale-90" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatedDiv>
        </div>
      </motion.div>
    </section>
  )
}
