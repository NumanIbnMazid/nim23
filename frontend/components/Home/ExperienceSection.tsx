import { FadeContainer, popUp } from "../../content/FramerMotionVariants"
import { HomeHeading } from "../../pages"
import { motion } from "framer-motion"
import * as WindowsAnimation from "@lib/windowsAnimation"
import React from "react"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAllExperiences } from "@lib/backendAPI"
import { TimelineItem } from "@components/TimelineItem"
import { TimelineList } from "@components/TimelineList"


export default function SkillSection() {
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    const experiencesData = await getAllExperiences()

    // TODO:Integrate with backend API
    // ******* Faking data Starts *******
    const fakeExperiencesData = experiencesData.map((experience: { title: any, body: any }, index: number) => ({
      title: "Software Engineer",
      company: experience.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
      company_url: "https:selise.com",
      duration: "2018 - 2019",
      description: experience.body
    }))
    // Need to use `experiencesData` in below `setExperiences` function!
    // ******* Faking data Ends *******

    setExperiences(fakeExperiencesData)
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
              {experiences.map((experience: { title: string, company: string, company_url: string, duration: string, description: string }, index) => (
                <motion.div
                  variants={popUp}
                  className="flex items-center justify-center gap-4 p-4 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
                >
                  <TimelineItem
                    key={index}
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
