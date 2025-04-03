import React from 'react'

interface Props {
  mediaUrlRef: React.RefObject<HTMLInputElement>
  fetchMediaDetails: () => void
  loading: boolean
}

const MediaInput: React.FC<Props> = ({ mediaUrlRef, fetchMediaDetails, loading }) => {
  return (
    <div>
      <label htmlFor="mediaUrl" className="block mt-4">
        Enter Video URL:
      </label>
      <input
        type="text"
        id="mediaUrl"
        defaultValue="https://www.youtube.com/watch?v=R3GfuzLMPkA&ab_channel=4KUltraHD"
        ref={mediaUrlRef}
        placeholder="Enter video URL"
        className="input input-bordered w-full mt-2 bg-gray-200 dark:bg-darkSecondary dark:text-gray-100"
      />
      <button
        onClick={fetchMediaDetails}
        disabled={loading}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent dark:text-blue-300 dark:hover:bg-blue-900 rounded my-4"
      >
        {loading ? 'Fetching...' : 'Get Video Details'}
      </button>
    </div>
  )
}

export default MediaInput
