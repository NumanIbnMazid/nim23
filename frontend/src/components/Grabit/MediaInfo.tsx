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
  const year = uploadDate.slice(0, 4)
  const month = uploadDate.slice(4, 6)
  const day = uploadDate.slice(6, 8)
  return `${year}-${month}-${day}`
}

const MediaInfo: React.FC<MediaInfoProps> = ({ mediaInfo, videoUrl }) => {
  return (
    <div className="mt-2 bg-gray-100 dark:bg-darkFifth p-4 rounded-lg shadow-md">
      {/* Video Details */}
      <div className="mt-4 flex flex-col items-center justify-center">
        {mediaInfo && mediaInfo.thumbnail && (
          <Image
            alt={mediaInfo.title}
            width={1000}
            height={1000}
            quality={50}
            style={{ width: 'auto', height: 'auto' }}
            src={mediaInfo.thumbnail}
            className="w-20 h-14 rounded-lg shadow-md"
          />
        )}

        <div className="mt-4 flex flex-col items-center">
          {mediaInfo && mediaInfo.title && <h2 className="text-lg font-semibold">{mediaInfo.title}</h2>}
        </div>

        <div className="flex items-center gap-4 mt-3 sm:flex-row flex-col md:gap-8">
          {mediaInfo && mediaInfo.author && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Author:</span> {mediaInfo.author} |
            </p>
          )}
          {mediaInfo && mediaInfo.resolution && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Resolution:</span> {mediaInfo.resolution} |
            </p>
          )}
          {mediaInfo && mediaInfo.duration && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Duration:</span> {mediaInfo.duration} seconds |
            </p>
          )}
          {mediaInfo && mediaInfo.duration && (
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
  )
}

export default MediaInfo
