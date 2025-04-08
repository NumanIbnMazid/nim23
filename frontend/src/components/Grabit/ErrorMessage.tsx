import React from 'react'

interface Props {
  error: string
}

const ErrorMessage: React.FC<Props> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto my-4 text-red-500">
      <div className="bg-transparent">
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  )
}

export default ErrorMessage
