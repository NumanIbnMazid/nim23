import React from 'react'

interface Props {
  statusMessage: string
}

const StatusMessage: React.FC<Props> = ({ statusMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto my-4 text-slate-900 dark:text-slate-100">
      <div className="bg-transparent p-4">
        <p className="text-slate-900 dark:text-slate-100">{statusMessage}</p>
      </div>
    </div>
  )
}

export default StatusMessage
