import React from 'react'

interface Props {
  onClick: () => void
  isLoading: boolean
}

const SubmitButton: React.FC<Props> = ({ onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {isLoading ? 'Humanizing...' : 'Humanize Text'}
  </button>
)

export default SubmitButton
