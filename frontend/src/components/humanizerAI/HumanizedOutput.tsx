'use client'

import React, { useState } from 'react'
import { FiCopy } from 'react-icons/fi'

interface Props {
  output: string
}

const HumanizedOutput: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">Humanized Output:</h3>
      {/* output */}
      <div className="relative bg-gray-100 dark:bg-[#182031] p-4 rounded-md mt-4 border dark:border-gray-700 h-80 overflow-auto">
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-900 dark:text-gray-100">{output}</pre>
      </div>

      {/* copy button */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {output.trim().split(/\s+/).filter(Boolean).length} words | {output.length} characters
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white transition"
        >
          <FiCopy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default HumanizedOutput
