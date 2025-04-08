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
    <div className='mt-4'>
      <label htmlFor="mediaType" className="text-md text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Select Media Type
      </label>
      <select
        id="mediaType"
        ref={mediaTypeRef}
        onChange={updateFormatOptions}
        className="mt-4 form-select appearance-none block w-full px-5 py-1 border rounded-lg bg-gray-200 dark:bg-darkSecondary dark:text-gray-100 shadow-lg placeholder-gray-400 focus:ring focus:outline-none"
      >
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>
    </div>
  )
}
export default MediaType
