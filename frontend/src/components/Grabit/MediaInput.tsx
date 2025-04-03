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
      <button onClick={fetchMediaDetails} disabled={loading} className="btn btn-primary mt-2">
        {loading ? 'Fetching...' : 'Get Video Details'}
      </button>
    </div>
  )
}

export default MediaInput
