import React from 'react'

interface Props {
  downloadMedia: () => void
  formatSelectRef: React.RefObject<HTMLSelectElement>
  loading: boolean
}

const DownloadButton: React.FC<Props> = ({ downloadMedia, loading }) => {
  return (
    <button onClick={downloadMedia} disabled={loading} className="btn btn-success mt-4">
      {loading ? 'Processing...' : 'Download'}
    </button>
  )
}

export default DownloadButton
