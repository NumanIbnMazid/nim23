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

  // create a method to convert filesize from bytes to MB or GB.
  function formatFilesize(filesize: number) {
    if (!filesize || filesize <= 0) return ''
    const kb = filesize / 1024 // Convert to KB
    const mb = kb / 1024 // Convert to MB
    const gb = mb / 1024 // Convert to GB
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`
    } else {
      return `${kb.toFixed(2)} KB`
    }
  }

  return (
    <div className="mt-4">
      <label htmlFor="formatSelect" className="text-md text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        Select Source Format
      </label>
      <select
        id="formatSelect"
        ref={selectedFormatRef}
        className="mt-4 form-select appearance-none block w-full px-5 py-1 border rounded-lg bg-gray-200 dark:bg-darkSecondary dark:text-gray-100 shadow-lg placeholder-gray-400 focus:ring focus:outline-none"
      >
        {formats.map((media, index) => (
          <option key={index} value={JSON.stringify(media)}>
            {`[${formatExtension(media.ext, media.format)}] ${media.quality}` +
              (media.resolution ? ` (${media.resolution})` : '') +
              (media.fps ? ` (${media.fps} fps)` : '') +
              (media.filesize ? ` (${formatFilesize(media.filesize)})` : '') +
              (media.is_dash ? ` (Dash)` : '')}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MediaSelect
