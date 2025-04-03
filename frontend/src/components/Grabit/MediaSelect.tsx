import React from 'react'

interface MediaFormat {
  format_details: string
  ext: string
}

interface Props {
  formats: MediaFormat[]
  formatSelectRef: React.RefObject<HTMLSelectElement>
}

const MediaSelect: React.FC<Props> = ({ formats, formatSelectRef }) => {
  return (
    <div>
      <label htmlFor="formatSelect" className="block mt-4">
        Select Format:
      </label>
      <select
        id="formatSelect"
        ref={formatSelectRef}
        className="select select-bordered w-full mt-2"
      >
        {formats.map((format, index) => (
          <option key={index} value={JSON.stringify(format)}>
            {format.format_details} ({format.ext})
          </option>
        ))}
      </select>
    </div>
  )
}

export default MediaSelect
