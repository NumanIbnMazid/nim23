'use client'

import { useState } from 'react'
import { FaFilter, FaTrash } from 'react-icons/fa'
import ActivePreferencesModal from '@/components/Recommendr/ActivePreferencesModal'

export default function PreferenceControls({ formData, onClear }: { formData: any; onClear: () => void }) {
  const [showModal, setShowModal] = useState(false)

  const hasActivePreferences = Object.values(formData).some((val) => {
    if (Array.isArray(val)) return val.length > 0
    if (typeof val === 'string') return val.trim() !== ''
    return !!val
  })

  if (!hasActivePreferences) return null

  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaFilter /> Active Preferences
      </button>
      <button
        onClick={onClear}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaTrash /> Clear Preferences
      </button>
      <ActivePreferencesModal isOpen={showModal} closeModal={() => setShowModal(false)} formData={formData} />
    </div>
  )
}
