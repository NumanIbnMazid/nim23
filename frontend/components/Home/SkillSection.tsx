import { FadeContainer, popUp } from "../../content/FramerMotionVariants"
import { HomeHeading } from "../../pages"
import { motion } from "framer-motion"
import { useDarkMode } from "@context/darkModeContext"
import * as WindowsAnimation from "@lib/windowsAnimation"
import React from "react"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAllSkills } from "@lib/backendAPI"


export default function SkillSection() {
  const { isDarkMode } = useDarkMode()
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const skillsData = await getAllSkills()

    // ******* Faking data Starts *******
    const fakeSkillsData = skillsData.map((skill: { title: any }, index: number) => ({
      name: `Python ${index + 1}`,
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s"
    }))
    // Need to use `skillsData` in below `setSkills` function!
    // ******* Faking data Ends *******

    setSkills(fakeSkillsData)
  }

  // ******* Loader Starts *******
  if (skills.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="My Top Skills" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-4 my-10"
      >
        {skills.map((skill: { name?: string, icon: string }, index) => {
          return (
            <motion.div
              variants={popUp}
              key={index}
              title={skill.name}
              onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
                WindowsAnimation.showHoverAnimation(e, isDarkMode)
              }
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                WindowsAnimation.removeHoverAnimation(e)
              }
              className="flex items-center justify-center gap-4 p-4 origin-center transform border border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
            >
              <div className="relative transition pointer-events-none select-none group-hover:scale-110 sm:group-hover:scale-100">
                {/* @ts-ignore */}
                {/* <Icon className="w-8 h-8" /> */}
                <Image src={skill.icon} width={50} height={50} alt="Skill Image" />
                {/* <b>{skill.icon}</b> */}
              </div>
              <p className="hidden text-sm font-semibold pointer-events-none select-none sm:inline-flex md:text-base">
                {skill.name}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
