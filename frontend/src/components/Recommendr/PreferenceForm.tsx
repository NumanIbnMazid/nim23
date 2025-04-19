'use client'

import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { FaCheck, FaPaperPlane, FaSliders, FaChevronDown, FaChevronUp } from 'react-icons/fa6'

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('#__app_root')
    }
  }, [])

  useEffect(() => {
    if (initialValues && initialValues.media_type) {
      setFormData((prev: any) => ({
        ...prev,
        genres: initialValues.genres || [],
        categories: initialValues.categories || [],
      }))
    }
  }, [initialValues?.media_type])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const closeModal = () => setModalIsOpen(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (key: string) => {
    setOpenSections((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleSelect = (key: keyof typeof formData, value: string, multi?: boolean) => {
    if (multi) {
      const selected = Array.isArray(formData[key]) ? (formData[key] as string[]) : []
      const updated = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      setFormData((prev: Record<string, unknown>) => ({ ...prev, [key]: updated }))
    } else {
      setFormData((prev: Record<string, unknown>) => ({ ...prev, [key]: value }))
    }
  }

  const canSubmit = formData.mood && formData.media_type

  const handleSubmit = () => {
    const payload = {
      mood: formData.mood,
      media_type: formData.media_type,
      language: formData.language.length > 0 ? formData.language : [''],
      occasion: formData.occasion.length > 0 ? formData.occasion : [''],
      genres: formData.genres.length > 0 ? formData.genres : [''],
      media_age: formData.media_age.length > 0 ? formData.media_age : [''],
      rating: formData.rating.length > 0 ? formData.rating : [''],
      categories: formData.categories.length > 0 ? formData.categories : [''],
      other_preferences: formData.other_preferences || '',
    }

    onSubmit(payload)
  }

  const fields = [
    { label: 'Language', key: 'language', options: preferences.language, multi: true },
    {
      label: 'Genres',
      key: 'genres',
      options: [
        ...(preferences.genres[formData.media_type] || []),
        ...(Array.isArray(formData.genres) ? formData.genres : []).filter(
          (g: string) => !(preferences.genres[formData.media_type] || []).includes(g)
        ),
      ],
      multi: true,
    },
    {
      label: 'Occasion',
      key: 'occasion',
      options: preferences.occasion,
      multi: true,
    },
    {
      label: 'Media Age',
      key: 'media_age',
      options: preferences.media_age,
      multi: true,
    },
    {
      label: 'Rating',
      key: 'rating',
      options: preferences.rating,
      multi: true,
    },
    {
      label: 'Categories',
      key: 'categories',
      options: [
        ...(preferences.categories[formData.media_type] || []),
        ...(Array.isArray(formData.categories) ? formData.categories : []).filter(
          (c: string) => !(preferences.categories[formData.media_type] || []).includes(c)
        ),
      ],
      multi: true,
    },
    {
      label: 'Other Preferences',
      key: 'other_preferences',
      isTextInput: true,
    },
  ]

  const renderField = ({ label, key, options, multi, isTextInput }: any) => {
    const isOpen = openSections.includes(key)

    return (
      <div key={key} className="border dark:border-gray-600 border-gray-200 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left font-medium text-gray-800 dark:text-white"
        >
          <span>{label}</span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {isOpen && (
          <div className="p-4 bg-white dark:bg-gray-800">
            {isTextInput ? (
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                placeholder="E.g. Songs by A.R. Rahman"
                value={formData.other_preferences}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, other_preferences: e.target.value }))}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {options?.map((option: string) => {
                  const isSelected = multi
                    ? (formData[key as keyof typeof formData] as string[])?.includes(option)
                    : formData[key as keyof typeof formData] === option

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(key, option, multi)}
                      className={`py-2 px-3 rounded-lg border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option} {isSelected && <FaCheck className="ml-2" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pick your preferences</h2>

      {/* Mood */}
      <div>
        <p className="font-medium text-gray-700 dark:text-white">
          Mood<span className="text-red-500 ml-1">*</span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {preferences.mood.map((m: string) => (
            <button
              key={m}
              onClick={() => handleSelect('mood', m)}
              className={`py-2 px-3 rounded-lg border transition ${
                formData.mood === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Media Type */}
      <div>
        <p className="font-medium text-gray-700 dark:text-white">
          Media Type<span className="text-red-500 ml-1">*</span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {preferences.media_types.map((t: string) => (
            <button
              key={t}
              onClick={() => handleSelect('media_type', t)}
              className={`py-2 px-3 rounded-lg border transition ${
                formData.media_type === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Button */}
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

      {/* Modal */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Advanced Filters"
        className="modal dark:bg-slate-800 dark:text-slate-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto my-20 overflow-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      >
        <div className="h-full">
          <div className="sticky top-0 bg-white dark:bg-slate-800 py-3 z-10">
            <button
              className="absolute top-4 right-0 font-extrabold bg-rose-500 text-red-300 rounded-full hover:bg-rose-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">Advanced Filters</h2>
          </div>

          <div className="flex-1 overflow-y-auto">{fields.map(renderField)}</div>

          <div className="flex justify-between items-center pt-2">
            <button className="mt-4 bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded" onClick={closeModal}>
              Close
            </button>
            {canSubmit && (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Get Recommendation <FaPaperPlane />
              </button>
            )}
          </div>
        </div>
      </ReactModal>
    </div>
  )
}
