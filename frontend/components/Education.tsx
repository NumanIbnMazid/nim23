import { FadeContainer, popUp } from '../content/FramerMotionVariants'
import { HomeHeading } from '../pages'
import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'
import { TimelineList } from '@components/TimelineList'
import { EducationType, MediaType } from '@lib/types'
import MediaModal from '@components/Modals/MediaModal'


export default function EducationSection({ educations }: { educations: EducationType[] }) {
  // ******* Loader Starts *******
  if (educations.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Educations" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p>Here's a brief rundown of my Academic Background.</p>
          {educations ? (
            <TimelineList>
              {educations.map((education: EducationType, index) => (
                <motion.div
                  key={index}
                  variants={popUp}
                  className="gap-4 p-2 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
                >
                  <article className="relative grid md:grid-cols-6 md:gap-10 before:content-[''] mx-6 before:block before:h-full before:absolute before:left-[-25px] md:before:left-[-37px] before:border-l-2 before:border-gray-300 dark:before:border-gray-700 md:space-x-4">
                    <div className="relative pb-12 md:col-span-3">
                      <div className="sticky top-28">
                        <svg
                          className="absolute left-[-38px] md:left-[-50px] color-bg-default color-fg-muted bg-white dark:bg-dark rounded-full dark:text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.5 11.75a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm1.444-.75a5.001 5.001 0 00-9.888 0H2.75a.75.75 0 100 1.5h4.306a5.001 5.001 0 009.888 0h4.306a.75.75 0 100-1.5h-4.306z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <h3 className="p-0 m-0 font-bold">{education.school}</h3>

                        {education.address ? (
                          <p className="p-0 m-0 text-sm font-light text-gray-500">{education.address}</p>
                        ) : null}

                        {education.image ? (
                          <div className="mt-2 mb-2">
                            <Image
                              src={education.image}
                              className="rounded-full shadow filter"
                              width={70}
                              height={70}
                              alt={education.school}
                              quality={100}
                              priority
                            />
                            <p className="p-0 m-0 mt-4">{education.degree}</p>
                          </div>
                        ) : null}

                        <p className="p-0 m-0 text-sm text-gray-500">
                          <span className="font-bold">{education.duration}</span>
                        </p>

                        {education.field_of_study ? (
                          <p className="p-0 m-0 text-sm font-bold text-gray-500 italic">
                            [{education.field_of_study}]
                          </p>
                        ) : null}

                        {education.grade ? (
                          <p className="p-0 m-0 text-sm font-light text-gray-500">{education.grade}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="relative md:border-gray-300 md:dark:border-gray-400 md:col-span-3 pt-6 text-sm">
                      {education.description ? (
                        <div dangerouslySetInnerHTML={{ __html: education.description }}></div>
                      ) : null}

                      {education.activities ? (
                        <p className="font-light text-sm mt-4">Activities: {education.activities}</p>
                      ) : null}

                      {education.education_media?.length ? (
                        // Here there will be a list of media. bullet points. There will be a button. After clicking the button new modal will open with the list of media.
                        <div className="mt-4">
                          <div className="mt-4">
                            <h2 className="font-bold">Attachments</h2>
                            {education.education_media.map((media: MediaType, mediaIndex) => (
                              <div key={mediaIndex} className="my-4">
                                  <MediaModal
                                  key={mediaIndex}
                                  title={media.title}
                                  file={media.file}
                                  description={media.description}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </motion.div>
              ))}
            </TimelineList>
          ) : null}
        </div>
      </motion.div>
    </section>
  )
}
