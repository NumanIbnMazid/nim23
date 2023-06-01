import React from "react"
import ProjectSection from "@components/Projects"
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"


export default function Projects() {
  return (
    <>
      <div className="relative max-w-4xl mx-auto dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-20 place-content-center"
        >
          <div>
            <ProjectSection />
          </div>
        </motion.section>
      </div>
    </>
  )
}
