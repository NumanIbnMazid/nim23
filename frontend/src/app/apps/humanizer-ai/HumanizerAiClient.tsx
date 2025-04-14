'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { HomeHeading } from '@/app/HomeClient'
import HumanizerInput from '@/components/humanizerAI/HumanizerInput'
import HumanizedOutput from '@/components/humanizerAI/HumanizedOutput'
import ErrorMessage from '@/components/humanizerAI/ErrorMessage'
import { fetchHumanizedText } from '@/lib/humanizerAI/fetchHumanizedText'

export default function HumanizerAiClient() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxLength = 500 // Words
  const minLength = 23 // Words

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize.')
      return
    }

    const wordCount = countWords(inputText)
    if (wordCount > maxLength) {
      setError(`Input exceeds ${maxLength} words. Current: ${wordCount}`)
      return
    }
    if (wordCount < minLength) {
      setError(`Input must be at least ${minLength} words. Current: ${wordCount}`)
      return
    }

    setLoading(true)
    setError('')
    setOutputText('')

    try {
      const result = await fetchHumanizedText(inputText)
      setOutputText(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    }

    setLoading(false)
  }

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  return (
    <div className="dark:bg-darkPrimary dark:text-gray-100">
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto py-16"
      >
        <div className="px-4">
          <HomeHeading title="Humanizer AI" />
          <div className="mt-8">
            <HumanizerInput
              inputText={inputText}
              maxLength={maxLength}
              minLength={minLength}
              setInputText={setInputText}
              onSubmit={handleSubmit}
              loading={loading}
            />
            {error && <ErrorMessage error={error} />}
            {outputText && <HumanizedOutput output={outputText} />}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
