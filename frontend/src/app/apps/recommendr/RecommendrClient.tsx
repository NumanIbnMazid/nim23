'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { getRecommendations } from '@/lib/recommendr/fetchRecommendations'
import PreferenceForm from '@/components/Recommendr/PreferencesForm/PreferenceForm'
import RecommendationList from '@/components/Recommendr/RecommendationList'
import LoadingRecommendations from '@/components/Recommendr/LoadingRecommendations'
import AppIntro from '@/components/Recommendr/AppIntro'
import SkeletonLoader from '@/components/SkeletonLoader'
import { useClientID } from '@/context/clientIdContext'
import PreferenceControls from '@/components/Recommendr/PreferenceControls'

export default function RecommendrClient({ preferencesChoices }: { preferencesChoices: any }) {
  const [preferences, setPreferences] = useState<any | null>(null)
  const [userPrefs, setUserPrefs] = useState<any | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [currentPreferences, setCurrentPreferences] = useState<any>(null)
  const { clientID } = useClientID()

  const [liveFormData, setLiveFormData] = useState<any>({
    mood: '',
    media_type: '',
    language: [],
    occasion: [],
    genres: [],
    media_age: [],
    rating: [],
    categories: [],
    other_preferences: '',
  })

  const clearPreferences = () => {
    const emptyForm = {
      mood: '',
      media_type: '',
      language: [],
      occasion: [],
      genres: [],
      media_age: [],
      rating: [],
      categories: [],
      other_preferences: '',
    }

    setLiveFormData(emptyForm)
    setUserPrefs(emptyForm) // <-- force PreferenceForm to reset
  }

  useEffect(() => {
    setPreferences(preferencesChoices)
    setLoading(false)
  }, [])

  const handleFormSubmit = async (prefs: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to top smoothly
    setUserPrefs(prefs)
    setRecommendationLoading(true)
    setShowForm(false)
    setCurrentPreferences(prefs)
    try {
      const response = await getRecommendations(prefs, clientID)
      setRecommendations(response || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setRecommendationLoading(false)
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
      <AppIntro />

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          {showForm && preferences && (
            <>
              <PreferenceControls formData={liveFormData} onClear={clearPreferences} />
              <PreferenceForm
                preferences={preferences}
                onSubmit={handleFormSubmit}
                initialValues={userPrefs}
                onChange={setLiveFormData}
              />
            </>
          )}
          {recommendationLoading && <LoadingRecommendations />}
          {!recommendationLoading && userPrefs && recommendations.length > 0 && (
            <RecommendationList
              results={recommendations}
              currentPreferences={currentPreferences}
              handleSubmit={handleFormSubmit}
              showForm={showForm}
              setShowForm={setShowForm}
            />
          )}
        </div>
      )}
    </motion.section>
  )
}
