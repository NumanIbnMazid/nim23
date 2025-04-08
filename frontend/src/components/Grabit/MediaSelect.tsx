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
    <div className="">
      <label htmlFor="formatSelect" className="block mt-4">
        Select Source Format:
      </label>
      <select
        id="formatSelect"
        ref={selectedFormatRef}
        className="select select-bordered w-full mt-2 bg-gray-200 dark:bg-darkSecondary dark:text-gray-100"
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
