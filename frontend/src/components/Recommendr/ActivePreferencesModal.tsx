'use client'

import ReactModal from 'react-modal'
import { FaRegFrown } from 'react-icons/fa'

export default function ActivePreferencesModal({
  isOpen,
  closeModal,
  formData,
}: {
  isOpen: boolean
  closeModal: () => void
  formData: any
}) {
  const preferenceLabels: { [key: string]: string } = {
    mood: 'Mood',
    media_type: 'Media Type',
    language: 'Languages',
    occasion: 'Occasions',
    genres: 'Genres',
    media_age: 'Media Age',
    rating: 'Ratings',
    categories: 'Categories',
    other_preferences: 'Other Preferences',
  }

  const getValidPreferences = () => {
    return Object.entries(preferenceLabels).reduce((acc, [key, label]) => {
      const val = formData?.[key]

      const isValid =
        (Array.isArray(val) && val.filter((v) => v && v.trim && v.trim() !== '').length > 0) ||
        (typeof val === 'string' && val.trim() !== '')

      if (!isValid) return acc

      const formatted = Array.isArray(val) ? val.filter((v) => v && v.trim && v.trim() !== '').join(', ') : val

      acc.push({ label, value: formatted })
      return acc
    }, [] as { label: string; value: string }[])
  }

  const activePreferences = getValidPreferences()

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Active Preferences"
      className="max-w-2xl mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl outline-none border border-gray-200 dark:border-gray-800"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Your Selected Preferences</h2>

      {activePreferences.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {activePreferences.map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {label}
              </div>
              <div className="text-base text-gray-900 dark:text-white leading-snug">{value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mt-6">
          <FaRegFrown className="text-3xl mb-2" />
          <p className="text-center text-sm">You haven’t selected any preferences yet.</p>
        </div>
      )}

      <button
        onClick={closeModal}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        Close
      </button>
    </ReactModal>
  )
}
