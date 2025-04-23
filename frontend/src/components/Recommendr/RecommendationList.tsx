'use client'

import { useState } from 'react'
import RecommendationCard from '@/components/Recommendr/RecommendationCard'
import { FaRedo, FaPen } from 'react-icons/fa'

export default function RecommendationList({
  results,
  currentPreferences,
  handleSubmit,
  showForm,
  setShowForm,
  setModifyPreferencesScrollToPrefs,
}: {
  results: any[]
  currentPreferences: any
  handleSubmit: (preferences: any) => void
  showForm: boolean
  setShowForm: (val: boolean) => void
  setModifyPreferencesScrollToPrefs: (val: boolean) => void
}) {
  const [loading, setLoading] = useState(false)

  const getMore = async () => {
    setLoading(true)
    await handleSubmit(currentPreferences)
    setLoading(false)
  }

  const handleModifyPreferences = () => {
    setShowForm(true)
    setModifyPreferencesScrollToPrefs(true) // trigger scroll after re-render
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3" id='recommendation-list'>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recommendations</h2>
      </div>

      {results.length === 0 ? (
        <p className="text-yellow-700 dark:text-yellow-600 text-center p-6 text-lg">
          Sorry! No recommendations found.
        </p>
      ) : (
        <div>
          <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 text-center pb-6">
            Note: Data might not always be accurate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {results.map((item, idx) => item.title !== '' && <RecommendationCard key={idx} recommendation={item} />)}
          </div>
        </div>
      )}

      {showForm === false && (
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleModifyPreferences}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
          >
            <FaPen /> Modify Preferences
          </button>
          <button
            onClick={getMore}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaRedo /> {loading ? 'Loading...' : 'Get More'}
          </button>
        </div>
      )}
    </div>
  )
}
