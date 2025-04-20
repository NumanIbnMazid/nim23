'use client'

import { FaRobot, FaUserEdit, FaRegSmileBeam } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function AppIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-md mb-10 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-3 text-pink-600 dark:text-pink-400">
        <FaUserEdit className="text-purple-500 text-4xl" />
        Humanizer AI
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-md md:text-lg leading-relaxed max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2">
          <FaRobot /> Got robotic AI text?
        </span>{' '}
        <span className="inline-flex items-center gap-2">
          <FaUserEdit /> Want it to sound human?
        </span>
        <br />
        <br />
        <span className="font-medium">Humanizer AI</span> is your free online tool to effortlessly transform stiff,
        robotic, or AI-generated content into smooth, <span className="font-semibold text-blue-500">natural</span> and{' '}
        <span className="font-semibold text-pink-500">human-sounding</span> language.
        <br />
        <br />
        Perfect for <span className="font-semibold">emails</span>, <span className="font-semibold">blogs</span>,{' '}
        <span className="font-semibold">social captions</span>, and more. Just paste, click, and watch your tone come
        alive. <FaRegSmileBeam className="inline text-yellow-500" />
      </p>
    </motion.div>
  )
}
