import React from 'react'

interface Props {
  downloadMedia: () => void
  selectedFormatRef: React.RefObject<HTMLSelectElement>
  loading: boolean
  progress: number
}

const DownloadButton: React.FC<Props> = ({ downloadMedia, loading, progress }) => {
  return (
    <div className="relative">
      <button
        onClick={downloadMedia}
        disabled={loading}
        className="bg-gray-300 dark:bg-teal-800 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded inline-flex items-center mt-6"
      >
        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        <span>{loading ? `Downloading...⏳ ${progress}%` : 'Download'}</span>
      </button>
      {loading && (
        <div className="h-4 w-full bg-gray-200 mt-8">
          <div className="h-4 bg-green-500 transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  )
}

export default DownloadButton
