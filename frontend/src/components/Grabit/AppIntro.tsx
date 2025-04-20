'use client'

import { motion } from 'framer-motion'
import { FaDownload, FaVideo, FaMusic, FaShieldAlt } from 'react-icons/fa'

export default function AppIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-md mb-10 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-3 text-blue-600 dark:text-blue-400">
        <FaDownload className="text-green-500" />
        Grabit
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-md md:text-lg leading-relaxed max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2">
          <FaVideo /> Want to save your favorite videos?
        </span>{' '}
        <span className="inline-flex items-center gap-2">
          <FaMusic /> Need that track offline?
        </span>
        <br />
        <br />
        <strong>Grabit</strong> is a powerful media downloader that helps you grab video and audio from{' '}
        <span className="font-medium text-blue-500">YouTube</span>,{' '}
        <span className="font-medium text-pink-500">Instagram</span>,{' '}
        <span className="font-medium text-purple-500">TikTok</span>,{' '}
        <span className="font-medium text-cyan-500">Twitter</span>,{' '}
        <span className="font-medium text-yellow-500">Facebook</span> and many more — all in one place.
        <br />
        <br />
        <span className="font-semibold">Fast</span>. <span className="font-semibold">Secure</span>.{' '}
        <span className="font-semibold">Completely Free</span>. <FaShieldAlt className="inline text-green-500" />
      </p>
    </motion.div>
  )
}
