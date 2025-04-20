'use client'

import { FaMagic, FaFilm, FaMusic, FaSmile } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function AppIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-md mb-10 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-3 text-blue-600 dark:text-blue-400">
        <FaMagic className="text-purple-500" />
        Recommendr
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-md md:text-lg leading-relaxed max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2">
          <FaSmile /> Feeling a certain way?
        </span>{' '}
        <span className="inline-flex items-center gap-2">
          <FaMusic /> Love music?
        </span>{' '}
        <span className="inline-flex items-center gap-2">
          <FaFilm /> Binge-worthy nights?
        </span>{' '}
        <br />
        <br />
        <span className="font-medium">Recommendr</span> is your smart media curator that tailors personalized{' '}
        <span className="font-semibold text-blue-500">movies</span>,{' '}
        <span className="font-semibold text-pink-500">music</span>,{' '}
        <span className="font-semibold text-yellow-500">TV shows</span>,{' '}
        <span className="font-semibold text-green-500">web series</span>, and{' '}
        <span className="font-semibold text-purple-500">documentaries</span> to your vibe and mood.
        <br />
        <br />
        Discover exactly what suits your moment — effortlessly and beautifully.
      </p>
    </motion.div>
  )
}
