import { FadeContainer, popUp } from '../../content/FramerMotionVariants'
import { motion } from 'framer-motion'
import React from 'react'
import { TimelineItem } from '@components/TimelineItem'
import { TimelineList } from '@components/TimelineList'
import { ExperienceType } from '@lib/types'
import AnimatedHeading from '@components/FramerMotion/AnimatedHeading'
import { headingFromLeft } from '@content/FramerMotionVariants'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ExperienceSection({ experiences }: { experiences: ExperienceType[] }) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  // limit experiences to 1 if on home page otherwise show all
  const experiencesToDisplay = isHomePage ? experiences.slice(0, 1) : experiences

  // ******* Loader Starts *******
  if (experiences.length === 0) {
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
          <span className="mr-2">Work Experiences</span>
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">{experiences.length}</span>
        </AnimatedHeading>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-7 space-y-6">
          <p className="mb-12">
            As an individual, I'm driven by a continuous desire for personal and professional growth. I'm always
            seeking opportunities to learn and expand my skill set. Here's a brief rundown of my professional
            experiences.
          </p>
          {experiencesToDisplay ? (
            <TimelineList>
              {experiencesToDisplay.map((experience: ExperienceType, index) => (
                <motion.div
                  key={index}
                  variants={popUp}
                  className="flex items-center justify-center gap-4 p-2 origin-center transform border-gray-300 rounded-sm sm:justify-start bg-gray-50 hover:bg-white dark:bg-darkPrimary hover:dark:bg-darkSecondary dark:border-neutral-700 md:origin-top group"
                >
                  <TimelineItem
                    designation={experience.designation}
                    company={experience.company}
                    company_image={experience.company_image}
                    company_url={experience.company_url}
                    address={experience.address}
                    job_type={experience.job_type}
                    duration={experience.duration}
                    duration_in_days={experience.duration_in_days}
                    description={experience.description}
                  />
                </motion.div>
              ))}
            </TimelineList>
          ) : null}
        </div>

        {/* View all experiences link */}
        {isHomePage && (
          <Link
            href="/about"
            className="mt-4 flex items-center justify-center gap-1 font-medium transition border-transparent font-inter active:scale-95 active:border-black w-fit group"
          >
            View all experiences
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 ml-1 transition group-hover:translate-x-2"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
              ></path>
            </svg>
          </Link>
        )}
      </motion.div>
    </section>
  )
}
