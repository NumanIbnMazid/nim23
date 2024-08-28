import { BsGithub } from 'react-icons/bs'
import { MdOutlineLink } from 'react-icons/md'
import Link from 'next/link'
import { ProjectType, MediaType } from '@lib/types'
import { motion } from 'framer-motion'
import { FadeContainer } from '../../content/FramerMotionVariants'
import { HomeHeading } from '..'
import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import { opacityVariant } from '@content/FramerMotionVariants'
import Image from 'next/image'
import PDFViewer from '@components/PDFViewer'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'
import * as LB from "@utils/yetAnotherlightboxImports"

export default function ProjectDetailsSection({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectType>()
  const [bannerLightBoxOpen, setBannerLightBoxOpen] = React.useState(false)
  const [mediaLightBoxOpen, setMediaLightBoxOpen] = React.useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaType>()

  const openMediaLightBoxViewer = useCallback((media: MediaType) => {
    setSelectedMedia(media)
    setMediaLightBoxOpen(true)
  }, [])

  const fetchProjectDetails = async (slug: any) => {
    try {
      const response = await fetch(`/api/projects/details?slug=${encodeURIComponent(slug)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const projectData: ProjectType = await response.json()
      setProject(projectData)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  function getFileExtensionFromBase64(base64String: string): string {
    const mimeType = base64String.match(/data:(.*?);/)?.[1]
    const [, fileExtension] = mimeType?.split('/') ?? []
    return fileExtension || ''
  }

  const isImageFile = (file: string): boolean => {
    if (file !== null) {
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'avif']
      const fileExtension = getFileExtensionFromBase64(file)
      return imageExtensions.includes(fileExtension.toLowerCase())
    }
    return false
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProjectDetails(slug)])
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  return (
    <>
      <Metadata
        title={project?.title || pageMeta.projects.title}
        description={project?.short_description || pageMeta.projects.description}
        previewImage={project?.image || pageMeta.projects.image}
        keywords={`${project?.technology || 'python project'}, ${pageMeta.projects.keywords}`}
      />

      {isLoading ? (
        <Loader />
      ) : project ? (
        <div className="dark:text-gray-100">
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="pageTop"
          >
            <section className="">
              <HomeHeading title={project.title} />

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={FadeContainer}
                viewport={{ once: true }}
                className="mb-10 mt-4 px-7 py-4 transform rounded-lg border-gray-300 sm:justify-start bg-darkWhitePrimary dark:bg-darkPrimary dark:border-neutral-700"
              >
                <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
                  {/* project cover image */}
                  <div className="flex items-center justify-center">
                    <Image
                      src={project?.image as string}
                      className="shadow filter hover:cursor-pointer"
                      width={1000}
                      height={1000}
                      alt={project.title}
                      quality={50}
                      style={{ width: 'auto', height: 'auto' }}
                      onClick={() => setBannerLightBoxOpen(true)}
                    />
                  </div>

                  <div className="">
                    <div className="text-center">
                      {/* <h1 className="font-bold text-neutral-900 dark:text-neutral-200 text-3xl">{project.title}</h1> */}
                      <h2 className="text-neutral-900 dark:text-neutral-200 text-lg">{project.short_description}</h2>
                      <p className="p-0 m-0 text-sm text-gray-500">
                        <span className="font-bold text-base">
                          {project.duration}
                          <span className="font-light text-sm ml-2">({project.duration_in_days})</span>
                        </span>
                      </p>
                    </div>

                    <div className="justify-center text-center">
                      {/* project technology */}
                      {project.technology && (
                        <div>
                          <h4 className="font-bold mb-4">Technology</h4>
                          <div className="flex flex-wrap items-center gap-1">
                            {project.technology.split(',').map((technology, index) => {
                              return (
                                <span
                                  key={`${technology}-${index}`}
                                  className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded dark:bg-gray-800"
                                >
                                  {technology}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* project links */}
                      {project.github_url || project.preview_url ? (
                        <div>
                          <h4 className="font-bold mb-4">Links</h4>
                          <div className="flex items-center justify-center">
                            {/* Centered Container */}
                            <div className="flex items-center gap-4 p-2 w-fit">
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
                      ) : null}
                    </div>

                    {/* project description */}
                    {project.description && (
                      <div
                        className="text-base text-gray-600 dark:text-neutral-300 mt-10"
                        dangerouslySetInnerHTML={{ __html: project.description || '' }}
                      ></div>
                    )}

                    {/* project media */}
                    {project.project_media?.length ? (
                      // Here there will be a list of media. bullet points. There will be a button. After clicking the button new modal will open with the list of media.
                      <div className="mb-6">
                        <h4 className="font-bold">Attachments</h4>
                        {project.project_media.map((media: MediaType, mediaIndex) => (
                          <div key={mediaIndex} className="my-4">
                            {/* serial number */}
                            <h2 className="italic text-gray-400 dark:text-neutral-400">#{mediaIndex + 1}</h2>

                            {/* media title */}
                            <h3>{media.title}</h3>

                            {/* Image file */}
                            {media.file !== null && isImageFile(media.file) && (
                              <div>
                                <Image
                                  src={media.file}
                                  className="hover:cursor-pointer"
                                  alt={media.title}
                                  width={1000}
                                  height={1000}
                                  quality={75}
                                  style={{ width: 'auto', height: 'auto' }}
                                  onClick={() => openMediaLightBoxViewer(media)}
                                />
                              </div>
                            )}

                            {/* pdf file */}
                            {media.file !== null && getFileExtensionFromBase64(media.file) === 'pdf' && (
                              <PDFViewer base64String={media.file} />
                            )}

                            {/* Fallback */}
                            {media.file === null && (
                              <div className="flex items-center justify-center">
                                <p className="text-red-500">No file attached!</p>
                              </div>
                            )}

                            {/* media description */}
                            <div dangerouslySetInnerHTML={{ __html: media.description }} className="mt-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </AnimatedDiv>
              </motion.div>
            </section>
          </motion.section>
        </div>
      ) : (
        <NoData allowSpacing={true} />
      )}


      {/* Banner Lightbox Start */}
      <LB.Lightbox
        plugins={[LB.Zoom, LB.Share, LB.Fullscreen, LB.Download, LB.Captions]}
        open={bannerLightBoxOpen}
        close={() => setBannerLightBoxOpen(false)}
        slides={[
          {
            src: project?.image as string,
          },
        ]}
        render={{ slide: LB.NextJsImage }}
      />
      {/* Banner Lightbox End */}

      {/* Media LightBox Start */}
      {project?.project_media?.length ? (
        <LB.Lightbox
          plugins={[LB.Zoom, LB.Share, LB.Fullscreen, LB.Download, LB.Captions]}
          counter={{ container: { style: { top: '3%' } } }}
          open={mediaLightBoxOpen}
          close={() => setMediaLightBoxOpen(false)}
          slides={[
            {
              src: selectedMedia?.file as string,
              alt: selectedMedia?.title,
              title: selectedMedia?.title,
            },
          ]}
        />
      ) : null}
      {/* Media LightBox End */}
    </>
  )
}


export async function getServerSideProps(context: any) {
  const { slug } = context.params
  return {
    props: {
      slug
    }
  }
}
