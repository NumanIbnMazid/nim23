import React from 'react'

const CharacterCounter = ({
  inputText,
  currentLength,
  maxLength,
  minLength,
}: {
  inputText: string
  currentLength: number
  maxLength: number
  minLength: number
}) => (
  <span className="text-sm text-gray-500 dark:text-gray-400">
    <span className="font-semibold text-sm">{currentLength} Words </span>
    <span className="text-xs font-extralight">({inputText.length} Characters) </span>
    <span>/ </span>
    <span className="font-semibold text-sm">{maxLength} Words </span>
    {currentLength < minLength && (
      <span>
        <span>| </span>
        <span className="text-xs font-light text-cyan-600">Minimum Length: {minLength} Words</span>
      </span>
    )}
  </span>
)

export default CharacterCounter
