import React from "react"
import Certificates from "@components/Certificates"
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"


export default function CertificateSection() {
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
            <Certificates />
          </div>
        </motion.section>
      </div>
    </>
  )
}
