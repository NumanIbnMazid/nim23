'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FadeContainer, opacityVariant } from '@/content/FramerMotionVariants'
import { FiArrowRight } from 'react-icons/fi'

export default function AppsClient({ apps }: { apps: { name: string; link: string, description: string }[] }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-16 mt-6">
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
              className="bg-darkWhiteSecondary dark:bg-darkFourth p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-center mb-4">{app.name}</h3>
              <h4 className="text-sm font-semibold text-center mb-4">{app.description}</h4>
              <div className="flex justify-center">
                <Link
                  href={app.link}
                  className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg flex items-center gap-2"
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
