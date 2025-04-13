import React from 'react'
import CharacterCounter from '@/components/humanizerAI/CharacterCounter'
import SubmitButton from '@/components/humanizerAI/SubmitButton'

interface Props {
  inputText: string
  maxLength: number
  setInputText: (text: string) => void
  onSubmit: () => void
  loading: boolean
}

const HumanizerInput: React.FC<Props> = ({ inputText, maxLength, setInputText, onSubmit, loading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length

    if (wordCount <= maxLength) {
      setInputText(value)
    }
  }
  return (
    <div className="mb-6">
      <textarea
        rows={10}
        value={inputText}
        onChange={handleChange}
        placeholder="Paste your AI-generated text here..."
        className="w-full p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-between items-center mt-2">
        <CharacterCounter inputText={inputText} currentLength={inputText.trim().split(/\s+/).filter(Boolean).length} maxLength={maxLength} />
        <SubmitButton onClick={onSubmit} isLoading={loading} />
      </div>
    </div>
  )
}

export default HumanizerInput
