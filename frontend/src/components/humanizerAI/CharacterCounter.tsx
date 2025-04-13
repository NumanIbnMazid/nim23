import React from 'react'

const CharacterCounter = ({ inputText, currentLength, maxLength }: { inputText: string; currentLength: number; maxLength: number }) => (
  <span className="text-sm text-gray-500 dark:text-gray-400">
    {currentLength} / {maxLength} Words | Characters count: {inputText.length}
  </span>
)

export default CharacterCounter
