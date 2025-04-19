'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'

import { getRecommendations } from '@/lib/recommendr/fetchRecommendations'
import PreferenceForm from '@/components/Recommendr/PreferenceForm'
import RecommendationList from '@/components/Recommendr/RecommendationList'
import LoadingRecommendations from '@/components/Recommendr/LoadingRecommendations'
import { HomeHeading } from '@/app/HomeClient'
import SkeletonLoader from '@/components/SkeletonLoader'
import { WEBSOCKET_URL } from '@/lib/constants'

export default function RecommendrClient({ preferencesChoices }: { preferencesChoices: any }) {
  const [preferences, setPreferences] = useState<any | null>(null)
  const [userPrefs, setUserPrefs] = useState<any | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [currentPreferences, setCurrentPreferences] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
    const connect = () => {
      try {
        ws = new WebSocket(`${WEBSOCKET_URL}/ws/logs/`)
        wsRef.current = ws

        ws!.onopen = () => {
          // console.log('✅ WebSocket connected')
          ws!.send(JSON.stringify({ type: 'ready' }))
        }
        ws.onclose = (e) => {
          // console.warn('🔌 WebSocket closed:', e)
          // Retry connection after a small delay if not closed cleanly
          if (!e.wasClean) {
            reconnectTimeout = setTimeout(() => {
              // console.log('🔄 Reconnecting WebSocket...')
              connect()
            }, 1000) // retry after 1 second
          }
        }
      } catch (err) {
        // console.error('WebSocket init error:', err)
      }
    }

    const timeout = setTimeout(() => {
      connect()
    }, 500) // wait 0.5 sec to ensure backend is ready

    return () => {
      if (ws) ws.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    setPreferences(preferencesChoices)
    setLoading(false)
  }, [])

  const handleFormSubmit = async (prefs: any) => {
    setUserPrefs(prefs)
    setRecommendationLoading(true)
    setShowForm(false)
    setCurrentPreferences(prefs)
    try {
      const response = await getRecommendations(prefs)
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
      <HomeHeading title="🎬 Recommendr" />

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          {showForm && preferences && (
            <PreferenceForm preferences={preferences} onSubmit={handleFormSubmit} initialValues={userPrefs} />
          )}
          {recommendationLoading && <LoadingRecommendations wsRef={wsRef} />}
          {!recommendationLoading && userPrefs && (
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
