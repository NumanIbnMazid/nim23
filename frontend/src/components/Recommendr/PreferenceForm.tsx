import { useState } from 'react'
import { FaCheck, FaPaperPlane, FaChevronDown, FaChevronUp } from 'react-icons/fa6'

export default function PreferenceForm({ preferences, onSubmit }: any) {
  const [formData, setFormData] = useState({
    mood: '',
    media_type: '',
    language: [] as string[],
    occasion: [] as string[],
    genre: [] as string[],
    media_age: [],
    rating: [],
    category: [],
    other_preferences: '',
  })

  const [openSections, setOpenSections] = useState(['mood', 'media_type'])

  const toggleSection = (key: string) => {
    setOpenSections((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const fields = [
    { label: 'Mood', key: 'mood', options: preferences.mood, required: true },
    { label: 'Media Type', key: 'media_type', options: preferences.media_types, required: true },
    { label: 'Language', key: 'language', options: preferences.language, multi: true },
    { label: 'Occasion', key: 'occasion', options: preferences.occasion, multi: true },
    {
      label: 'Genre',
      key: 'genre',
      options: preferences.genres[formData.media_type] || [],
      multi: true,
    },
    { label: 'Media Age', key: 'media_age', options: preferences.media_age, multi: true },
    { label: 'Rating', key: 'rating', options: preferences.rating, multi: true },
    {
      label: 'Category',
      key: 'category',
      options: preferences.categories[formData.media_type] || [],
      multi: true,
    },
    { label: 'Other Preferences', key: 'other_preferences', isTextInput: true },
  ]

  const handleSelect = (key: keyof typeof formData, value: string, multi?: boolean) => {
    if (multi) {
      const selected = formData[key] as string[]
      const updated = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      setFormData((prev) => ({ ...prev, [key]: updated }))
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }))
    }
  }
  const handleSubmit = () => {
    const payload = {
      mood: formData.mood,
      media_type: formData.media_type,
      language: formData.language.length > 0 ? formData.language : [''],
      occasion: formData.occasion.length > 0 ? formData.occasion : [''],
      genres: formData.genre.length > 0 ? formData.genre : [''],
      media_age: formData.media_age.length > 0 ? formData.media_age : [''],
      rating: formData.rating.length > 0 ? formData.rating : [''],
      categories: formData.category.length > 0 ? formData.category : [''],
      other_preferences: formData.other_preferences || '',
    }

    onSubmit(payload)
  }

  const renderField = ({ label, key, options, multi, isTextInput, required }: any) => {
    const isOpen = openSections.includes(key)

    return (
      <div key={key} className="border dark:border-gray-600 border-gray-200 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left font-medium text-gray-800 dark:text-white"
        >
          <span className=''>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {isOpen && (
          <div className="p-4 bg-white dark:bg-gray-800">
            {isTextInput ? (
              <textarea
                rows={3}
                placeholder="E.g. Movie like Interstellar, Song by Scorpions etc."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                value={formData.other_preferences}
                onChange={(e) => setFormData((prev) => ({ ...prev, other_preferences: e.target.value }))}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {options?.map((option: string) => {
                  const isSelected = multi
                    ? (formData[key as keyof typeof formData] as string[]).includes(option)
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
                })}{' '}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const canSubmit = formData.mood && formData.media_type

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto my-12">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pick your preferences</h2>
      {fields.map(renderField)}

      {canSubmit && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Get Recommendation <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  )
}
