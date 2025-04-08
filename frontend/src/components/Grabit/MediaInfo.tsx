import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MediaInfoProps {
  mediaInfo: {
    title: string
    description: string | null
    author: string | null
    upload_date: string | null
    duration: number | null
    resolution: string | null
    thumbnail: string | null
    channel: string | null
    view_count: number | null
    source: string
  }
  videoUrl: string
}

// format upload data from 20241125 to 2024-11-25
function formatUploadDate(uploadDate: string | null): string | null {
  if (!uploadDate) return null

  // Already formatted: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(uploadDate)) {
    return uploadDate
  }

  // Compact format: YYYYMMDD
  if (/^\d{8}$/.test(uploadDate)) {
    const year = uploadDate.slice(0, 4)
    const month = uploadDate.slice(4, 6)
    const day = uploadDate.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  // Fallback if format is unrecognized
  return uploadDate
}

const MediaInfo: React.FC<MediaInfoProps> = ({ mediaInfo, videoUrl }) => {
  return (
    <div className="mt-2 bg-gray-100 dark:bg-darkFifth p-4 rounded-lg shadow-md">
      {/* Video Details */}
      <div className="mt-4 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-6">
        {/* Thumbnail */}
        {mediaInfo && mediaInfo.thumbnail && (
          <div className="flex-shrink-0">
            <Image
              alt={mediaInfo.title}
              width={250}
              height={250}
              quality={50}
              // style={{ width: '160px', height: '120px' }} // override if needed
              src={mediaInfo.thumbnail}
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Text Info */}
        <div className="text-center md:text-left">
          {mediaInfo?.title && <h2 className="text-lg font-semibold mt-4 md:mt-0">{mediaInfo.title}</h2>}

          <div className="flex items-center gap-4 mt-3 sm:flex-row flex-col md:gap-8">
            {mediaInfo?.author && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Author:</span> {mediaInfo.author} |
              </p>
            )}
            {mediaInfo?.resolution && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Resolution:</span> {mediaInfo.resolution} |
              </p>
            )}
            {mediaInfo?.duration && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Duration:</span> {mediaInfo.duration} seconds |
              </p>
            )}
            {mediaInfo?.upload_date && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Uploaded on:</span> {formatUploadDate(mediaInfo.upload_date)} |
              </p>
            )}
          </div>

          {/* Video Source */}
          {videoUrl && (
            <div className="my-6">
              <Link
                href={videoUrl}
                title="View Blog Details"
                prefetch={true}
                className="text-blue-500 rounded-full outline-cyan-500 border-dotted border bg-slate-200 dark:bg-darkSecondary hover:bg-gray-200 dark:hover:bg-darkThird hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-700 p-2"
                target="_blank"
              >
                View on {mediaInfo.source}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaInfo
