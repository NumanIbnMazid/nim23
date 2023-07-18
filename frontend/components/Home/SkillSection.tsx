import { FadeContainer, popUp } from '../../content/FramerMotionVariants'
import { HomeHeading } from '../../pages'
import { motion } from 'framer-motion'
import React from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAllSkills } from '@lib/backendAPI'
import { SkillType } from '@lib/types'
import NoData from "@components/NoData"

export default function SkillSection() {
  const [skills, setSkills] = useState<SkillType[]>([])

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const skillsData = await getAllSkills()
    setSkills(skillsData)
  }

  // ******* Loader Starts *******
  if (skills.length < 1) {
    return (
      <NoData topic="Skills" />
    )
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Skills" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="mt-12 space-y-6 mb-10"
      >
        <p className="mb-12">
          I possess a diverse range of skills that contribute to my effectiveness in tech industry.
          Through experience and continuous learning, I have developed proficiency in various areas. Here are some of my key skills.
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-10'>
          {skills.map((skill: SkillType, index) => {
          const level = Number(skill.level) || 0 // Convert level to a number or use 0 if it's null or invalid
          const progressPercentage = (level / 5) * 100 // Calculate the progress percentage
          const progressBarStyle = {
            width: `${progressPercentage}%`,
          }

          return (
            <motion.div
              variants={popUp}
              key={index}
              title={skill.title}
              className="p-2 origin-center transform border border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
            >
              <div className="flex items-center justify-center">
                <div className="relative transition pointer-events-none select-none group-hover:scale-110 sm:group-hover:scale-100">
                  <Image src={skill.image} width={50} height={50} alt={skill.title} quality={50} />
                </div>

                <p className="text-sm font-semibold pointer-events-none select-none sm:inline-flex md:text-base ml-2">
                  {skill.title}
                </p>
              </div>
              {skill.level !== null ? (
                <div className="w-full h-2 bg-gray-300 rounded-full my-2 dark:bg-gray-200">
                  <div className="h-full bg-emerald-600 rounded-full dark:bg-emerald-400" style={progressBarStyle} />
                </div>
              ) : null}
            </motion.div>
          )
        })}
        </div>
      </motion.div>
    </section>
  )
}
