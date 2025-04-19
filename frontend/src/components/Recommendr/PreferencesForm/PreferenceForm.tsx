'use client'

import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { FaPaperPlane, FaSliders } from 'react-icons/fa6'
import RequiredFields from '@/components/Recommendr/PreferencesForm/RequiredFields'
import ModalWrapper from '@/components/Recommendr/PreferencesForm/ModalWrapper'
import { buildPayload, getFieldDefinitions } from '@/lib/recommendr/preferencesFormUtils'

export default function PreferenceForm({ preferences, onSubmit, initialValues }: any) {
  const [formData, setFormData] = useState(
    initialValues || {
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
  )

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('#__app_root')
    }
  }, [])

  useEffect(() => {
    if (initialValues?.media_type) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        genres: (initialValues.genres || []).filter((g: string) => g.trim() !== ''),
        categories: (initialValues.categories || []).filter((c: string) => c.trim() !== ''),
      }))
    }
  }, [initialValues?.media_type])

  const canSubmit = formData.mood && formData.media_type

  const handleSelect = (key: keyof typeof formData, value: string, multi?: boolean) => {
    setFormData((prev: typeof formData) => {
      // Handle multi-select fields
      if (multi) {
        const currentValue = prev[key]
        return {
          ...prev,
          [key]: Array.isArray(currentValue)
            ? currentValue.includes(value)
              ? currentValue.filter((v: string) => v !== value)
              : [...currentValue, value]
            : [value],
        }
      }

      // Only reset genres/categories if media_type is *changing*
      if (key === 'media_type' && value !== prev.media_type) {
        return {
          ...prev,
          media_type: value,
          genres: [],
          categories: [],
        }
      }

      return {
        ...prev,
        [key]: value,
      }
    })
  }

  const handleSubmit = () => {
    const payload = buildPayload(formData)
    onSubmit(payload)
  }

  const fields = getFieldDefinitions(preferences, formData)

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pick your preferences</h2>

      <RequiredFields preferences={preferences} formData={formData} handleSelect={handleSelect} />

      {canSubmit && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
          <button
            onClick={() => setModalIsOpen(true)}
            className="inline-flex items-center gap-2 my-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FaSliders /> Advanced Filters
          </button>

          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Get Recommendation <FaPaperPlane />
          </button>
        </div>
      )}

      <ModalWrapper
        isOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        fields={fields}
        formData={formData}
        handleSelect={handleSelect}
        openSections={openSections}
        toggleSection={(key: string) =>
          setOpenSections((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
        }
        handleChangeText={(val: string) =>
          setFormData((prev: typeof formData) => ({ ...prev, other_preferences: val }))
        }
        canSubmit={canSubmit}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
