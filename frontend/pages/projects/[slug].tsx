import { BsGithub } from 'react-icons/bs'
import { MdOutlineLink } from 'react-icons/md'
import Link from 'next/link'
import OgImage from '@components/OgImage'
import { ProjectType } from '@lib/types'
import { motion } from 'framer-motion'
import { popUp } from '../../content/FramerMotionVariants'
import { FadeContainer } from '../../content/FramerMotionVariants'
import { HomeHeading } from '..'
import React from 'react'
import { useEffect, useState } from 'react'
import { getProjectDetails } from '@lib/backendAPI'
import { useRouter } from 'next/router'

export default function ProjectDetailsSection() {
  const router = useRouter();
  const { slug } = router.query; // Retrieve the slug parameter from the URL

  const [project, setProject] = useState<ProjectType>()

  const fetchProjectDetails = async (slug: string) => {
    try {
      const projectData: ProjectType = await getProjectDetails(slug);
      setProject(projectData);
    } catch (error) {
      // Handle error case
      console.error(error);
    }
  };

  // Add this useEffect to trigger the API request when slug is available
  useEffect(() => {
    if (typeof slug === 'string') {
      fetchProjectDetails(slug);
    }
  }, [slug]);

  return (
    <>
    {project && (
      <div className="relative max-w-4xl mx-auto dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-20 place-content-center"
        >
          <section className="mx-12">
            <HomeHeading title="Project Details" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={FadeContainer}
              viewport={{ once: true }}
              className="grid grid-cols-1 mb-10"
            >
              <div className="mt-12 space-y-6">
                <motion.div
                  key={project.id}
                  variants={popUp}
                  className="flex items-center justify-center gap-4 p-4 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
                >
                  <div className="card">
                    <OgImage src={project?.image as string} alt={project.title} />

                    <div className="flex flex-col justify-start gap-3">
                      <Link
                        href={project.slug}
                        title="View Project Details"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-black dark:hover:text-white hover:underline"
                      >
                        <h1 className="font-bold text-neutral-900 dark:text-neutral-200 text-xl">{project.title}</h1>
                      </Link>

                      <h2 className="text-neutral-900 dark:text-neutral-200 text-sm">{project.short_description}</h2>

                      <p className="p-0 m-0 text-sm text-gray-500">
                        <span className="font-bold">
                          {project.duration}
                          <span className="font-light text-xs ml-2">({project.duration_in_days})</span>
                        </span>
                      </p>

                      {project.description && (
                        <div
                          className="text-sm text-gray-500 dark:text-neutral-400"
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
              </div>
            </motion.div>
          </section>
        </motion.section>
      </div>
    )}
    </>
  )
}
