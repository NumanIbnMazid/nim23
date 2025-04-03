import React from 'react'

interface MediaFormat {
  format: string
  format_id: string
  ext: string
  quality: string
  bitrate?: number
  fps?: number
  filesize: number
  resolution?: string
  has_audio: boolean
  is_dash: boolean
  url: string
}

interface Props {
  formats: MediaFormat[]
  selectedFormatRef: React.RefObject<HTMLSelectElement>
}

const MediaSelect: React.FC<Props> = ({ formats, selectedFormatRef }) => {
  // function formatBitrate(bitrate: number) {
  //   if (!bitrate || bitrate <= 0) return "";

  //   const kbps = bitrate / 1000; // Convert to kbps
  //   const mbps = kbps / 1000; // Convert to Mbps

  //   return kbps >= 1000 ? `${mbps.toFixed(2)} Mbps` : `${kbps.toFixed(2)} kbps`;
  // }

  function formatExtension(ext: string, format: string) {
    if (format === 'video') {
      return ext === 'mp4' ? 'MP4' : ext.toUpperCase()
    }
    if (format === 'audio') {
      return ext === 'mp4' ? 'M4A' : ext.toUpperCase()
    }
  }

  return (
    <div className="">
      <label htmlFor="formatSelect" className="block mt-4">
        Select Format:
      </label>
      <select
        id="formatSelect"
        ref={selectedFormatRef}
        className="select select-bordered w-full mt-2 bg-gray-200 dark:bg-darkSecondary dark:text-gray-100"
      >
        {formats.map((format, index) => (
          <option key={index} value={JSON.stringify(format)}>
            {`[${formatExtension(format.ext, format.format)}] ${format.quality}` +
              (format.fps ? ` (${format.fps} fps)` : '') +
              (format.filesize ? ` (${(format.filesize / 1024 / 1024).toFixed(2)} MB)` : '') +
              (format.is_dash ? ` (Dash)` : '')}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MediaSelect
