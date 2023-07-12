import { FadeContainer, popUp } from '../content/FramerMotionVariants'
import { HomeHeading } from '../pages'
import { motion } from 'framer-motion'
import React from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAllInterests } from '@lib/backendAPI'
import { InterestType } from '@lib/types'
import NoData from "@components/NoData"


export default function InterestSection() {
  const [interests, setInterests] = useState<InterestType[]>([])

  useEffect(() => {
    fetchInterests()
  }, [])

  const fetchInterests = async () => {
    const interestsData = await getAllInterests()
    setInterests(interestsData)
  }

  // ******* Loader Starts *******
  if (interests.length < 1) {
    return (
      <NoData topic="Interests" />
    )
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Interests" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="mt-12 space-y-6 mb-10"
      >
        <p className="mb-12">
          Beyond my professional pursuits, I have a diverse range of interests that fuel my creativity, enhance my problem-solving abilities,
          and bring balance to my life. Here are a few of my passions outside of work.
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-10'>
          {interests.map((interest: InterestType, index) => {
          return (
            <motion.div
              variants={popUp}
              key={index}
              title={interest.title}
              className="p-2 origin-center transform border border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
            >
              <div className="flex items-center justify-center">
                <div className="relative transition pointer-events-none select-none group-hover:scale-110 sm:group-hover:scale-100">
                  <Image src={interest.icon} width={50} height={50} alt={interest.title} />
                </div>

                <p className="text-sm font-semibold pointer-events-none select-none sm:inline-flex md:text-base ml-2">
                  {interest.title}
                </p>
              </div>
            </motion.div>
          )
        })}
        </div>
      </motion.div>
    </section>
  )
}
