import React, { useState } from 'react'

interface Props {
  mediaUrlRef: React.RefObject<HTMLInputElement>
  fetchMediaDetails: () => void
  loading: boolean
}

const MediaInput: React.FC<Props> = ({ mediaUrlRef, fetchMediaDetails, loading }) => {
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    const url = mediaUrlRef.current?.value.trim()

    if (!url) {
      setError('Please enter a valid URL')
      return
    }

    // Optional: Regex to validate URL format
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/
    if (!urlPattern.test(url)) {
      setError('Invalid URL format')
      return
    }

    setError(null)
    fetchMediaDetails()
  }

  return (
    <div>
      <input
        type="text"
        id="mediaUrl"
        defaultValue=""
        ref={mediaUrlRef}
        placeholder="Enter video URL"
        className="block w-full px-0 py-4 mt-2 mb-4 bg-transparent border-0 border-b-2 appearance-none text-white-900 border-slate-500 dark:text-white dark:border-gray-400 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-black peer text-lg dark:placeholder:text-gray-400 placeholder:text-gray-500"
        required
      />
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent dark:text-blue-300 dark:hover:bg-blue-900 rounded my-4"
      >
        {loading ? 'Fetching video metadata...⏳' : 'Click to start download 📥'}
      </button>
    </div>
  )
}

export default MediaInput
