import { FadeContainer, popUp } from "../../content/FramerMotionVariants"
import { HomeHeading } from "../../pages"
import { motion } from "framer-motion"
import React from "react"
import { useEffect, useState } from 'react'
import { getAllExperiences } from "@lib/backendAPI"
import { TimelineItem } from "@components/TimelineItem"
import { TimelineList } from "@components/TimelineList"
import { ExperienceType } from "@lib/types"


export default function SkillSection() {
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    const experiencesData = await getAllExperiences()
    setExperiences(experiencesData)
  }

  // ******* Loader Starts *******
  if (experiences.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Work experience" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p>Here's a brief rundown of my most recent experiences.</p>
          {experiences ? (
            <TimelineList>
              {experiences.map((experience: ExperienceType, index) => (
                <motion.div
                  key={index}
                  variants={popUp}
                  className="flex items-center justify-center gap-4 p-4 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
                >
                  <TimelineItem
                    title={experience.title}
                    meta={experience.company}
                    link={experience.company_url}
                    meta_small={experience.duration}
                    content={experience.description}
                  />
                </motion.div>
              ))}
            </TimelineList>
          ) : null}
        </div>
      </motion.div>
    </section>
  )
}
