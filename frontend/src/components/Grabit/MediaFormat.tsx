import React from 'react'

interface Props {
  mediaTypeRef: React.RefObject<HTMLSelectElement>
  mediaFormatRef: React.RefObject<HTMLSelectElement>
}

const MediaFormat: React.FC<Props> = ({ mediaTypeRef, mediaFormatRef }) => {
  const videoFormats = ['mp4', 'mkv']
  const audioFormats = ['mp3', 'wav']

  const getFormats = () => {
    const selectedType = mediaTypeRef.current?.value || 'video'
    return selectedType === 'video' ? videoFormats : audioFormats
  }

  return (
    <div className="mt-4">
      <label htmlFor="formatSelect" className="text-md text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Select Target Format
      </label>
      <select
        id="formatSelect"
        ref={mediaFormatRef}
        className="mt-4 form-select appearance-none block w-full px-5 py-1 border rounded-lg bg-gray-200 dark:bg-darkSecondary dark:text-gray-100 shadow-lg placeholder-gray-400 focus:ring focus:outline-none"
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
