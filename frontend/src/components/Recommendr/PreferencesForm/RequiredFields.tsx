import React from 'react'

export default function RequiredFields({ preferences, formData, handleSelect }: any) {
  return (
    <>
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
    </>
  )
}
