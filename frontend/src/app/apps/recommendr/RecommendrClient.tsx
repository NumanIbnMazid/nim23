'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { getPreferences } from '@/lib/recommendr/fetchPreferences'
import { getRecommendations } from '@/lib/recommendr/fetchRecommendations'
import PreferenceForm from '@/components/Recommendr/PreferenceForm'
import RecommendationList from '@/components/Recommendr/RecommendationList'
import LoadingRecommendations from '@/components/Recommendr/LoadingRecommendations'
import { HomeHeading } from '@/app/HomeClient'

export default function RecommendrClient() {
  const [preferences, setPreferences] = useState<any | null>(null)
  const [userPrefs, setUserPrefs] = useState<any | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [currentPreferences, setCurrentPreferences] = useState<any>(null)

  useEffect(() => {
    getPreferences().then(setPreferences)
  }, [])

  const handleFormSubmit = async (prefs: any) => {
    setUserPrefs(prefs)
    setLoading(true)
    setShowForm(false)
    setCurrentPreferences(prefs)
    try {
      const response = await getRecommendations(prefs)
      setRecommendations(response || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={FadeContainer}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <HomeHeading title="🎬 Recommendr" />
      {showForm && preferences && <PreferenceForm preferences={preferences} onSubmit={handleFormSubmit} />}
      {loading && <LoadingRecommendations />}
      {!loading && userPrefs && (
        <RecommendationList
          results={recommendations}
          currentPreferences={currentPreferences}
          handleSubmit={handleFormSubmit}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
    </motion.section>
  )
}
