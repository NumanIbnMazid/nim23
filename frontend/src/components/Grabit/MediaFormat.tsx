import React from 'react'

interface Props {
  mediaTypeRef: React.RefObject<HTMLSelectElement>
  mediaFormatRef: React.RefObject<HTMLSelectElement>
}

const MediaFormat: React.FC<Props> = ({ mediaTypeRef, mediaFormatRef }) => {
  const videoFormats = ['mp4', 'mkv', 'webm']
  const audioFormats = ['mp3', 'wav', 'aac', 'flac', 'webm']

  const getFormats = () => {
    const selectedType = mediaTypeRef.current?.value || 'video'
    return selectedType === 'video' ? videoFormats : audioFormats
  }

  return (
    <div className="mt-4">
      <label htmlFor="formatSelect" className="block">
        Select Target Format:
      </label>
      <select
        id="formatSelect"
        ref={mediaFormatRef}
        className="input input-bordered w-full mt-2 bg-gray-200 dark:bg-darkSecondary dark:text-gray-100"
      >
        {getFormats().map((format, index) => (
          <option key={index} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MediaFormat
