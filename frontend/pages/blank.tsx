import { motion } from 'framer-motion'
import { FadeContainer } from '../content/FramerMotionVariants'
import { HomeHeading } from '.'
import React from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import { opacityVariant } from '@content/FramerMotionVariants'

export default function ProjectDetailsSection() {
  const item = 123;

  return (
    <>
      {item && (
        <div className="dark:bg-darkPrimary dark:text-gray-100">
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="pageTop"
          >
            <section className="">
              <HomeHeading title="My Page Title" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={FadeContainer}
                viewport={{ once: true }}
                className="mb-10 mt-4 px-7 py-4 transform rounded-lg border-gray-300 sm:justify-start bg-white dark:bg-darkSecondary dark:border-neutral-700"
              >
                <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">

                  {/* place content here */}

                </AnimatedDiv>
              </motion.div>
            </section>
          </motion.section>
        </div>
      )}
    </>
  )
}
