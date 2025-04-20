'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FadeContainer, opacityVariant } from '@/content/FramerMotionVariants'
import { FiArrowRight } from 'react-icons/fi'
import { ReactNode } from 'react'

export default function AppsClient({
  apps,
}: {
  apps: { name: string; link: string; description: string; icon: ReactNode }[]
}) {
  return (
    <div className="px-4">
      <div className="max-w-6xl mx-auto py-16 mt-6 px-2">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h1 variants={opacityVariant} className="text-4xl sm:text-5xl font-bold mb-10">
            Explore Apps by NIM23
          </motion.h1>
        </motion.section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {apps.map((app, index) => (
            <motion.div
              key={index}
              variants={opacityVariant}
              className="shadow-lg hover:shadow-2xl transition-all duration-300 w-full p-4 bg-white dark:bg-darkFourth ring-1 hover:bg-darkWhite dark:hover:bg-darkThird dark:hover:ring-[#555] ring-gray-300 hover:ring-gray-400 dark:ring-[#444] flex flex-col gap-2 rounded"
            >
              <div className="flex justify-center mb-3">{app.icon}</div>
              <h3 className="text-3xl font-semibold text-center mb-2">{app.name}</h3>
              <h4 className="text-sm text-center mb-4">{app.description}</h4>
              <div className="flex justify-center">
                <Link
                  href={app.link}
                  className="text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-800 dark:hover:bg-teal-900 py-2 px-6 rounded-lg flex items-center gap-2"
                >
                  <span>Go to App</span>
                  <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
