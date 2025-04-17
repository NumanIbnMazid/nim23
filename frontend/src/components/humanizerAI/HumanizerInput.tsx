import React, { useState } from 'react'
import CharacterCounter from '@/components/humanizerAI/CharacterCounter'
import SubmitButton from '@/components/humanizerAI/SubmitButton'

interface Props {
  inputText: string
  maxLength: number
  minLength: number
  setInputText: (text: string) => void
  onSubmit: () => void
  loading: boolean
}

const HumanizerInput: React.FC<Props> = ({ inputText, maxLength, minLength, setInputText, onSubmit, loading }) => {
  const [showLimitNotice, setShowLimitNotice] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const words = value.trim().split(/\s+/).filter(Boolean)

    if (words.length > maxLength) {
      let wordCount = 0
      let cutoffIndex = value.length
      let insideWord = false

      for (let i = 0; i < value.length; i++) {
        const char = value[i]

        if (/\S/.test(char)) {
          if (!insideWord) {
            wordCount++
            insideWord = true
          }
        } else {
          insideWord = false
        }

        if (wordCount > maxLength) {
          cutoffIndex = i
          break
        }
      }

      const truncated = value.slice(0, cutoffIndex).trimEnd()
      setInputText(truncated)
      setShowLimitNotice(true)
    } else {
      setInputText(value)
      setShowLimitNotice(false)
    }
  }

  return (
    <div className="mb-6">
      <textarea
        rows={8}
        value={inputText}
        onChange={handleChange}
        placeholder="Paste your AI-generated text here..."
        className="w-full p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showLimitNotice && (
        <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
          Your text exceeded the word limit of {maxLength}. It has been truncated to fit within the limit.
        </p>
      )}
      <div className="flex justify-between items-center mt-2 flex-wrap gap-4">
        <CharacterCounter
          inputText={inputText}
          currentLength={inputText.trim().split(/\s+/).filter(Boolean).length}
          maxLength={maxLength}
          minLength={minLength}
        />
        <SubmitButton onClick={onSubmit} isLoading={loading} />
      </div>
    </div>
  )
}

export default HumanizerInput
