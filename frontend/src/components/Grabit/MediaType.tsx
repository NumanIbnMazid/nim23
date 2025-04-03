import React from 'react'

interface MediaFormat {
  format_details: string
  ext: string
}

interface Props {
  mediaData: {
    formats_filtered: {
      best_video: MediaFormat
      video_formats: MediaFormat[]
      best_audio: MediaFormat
      audio_formats: MediaFormat[]
    }
  } | null
  mediaTypeRef: React.RefObject<HTMLSelectElement>
  updateFormatOptions: () => void
}

const MediaType: React.FC<Props> = ({ mediaData, mediaTypeRef, updateFormatOptions }) => {

  if (!mediaData) {
    return null
  }

  return (
    <div>
      <label htmlFor="mediaType" className="block mt-4">
        Select Media Type:
      </label>
      <select
        id="mediaType"
        ref={mediaTypeRef}
        onChange={updateFormatOptions}
        className="select select-bordered w-full mt-2 bg-gray-200 dark:bg-darkSecondary dark:text-gray-100"
      >
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>
    </div>
  )
}
export default MediaType
