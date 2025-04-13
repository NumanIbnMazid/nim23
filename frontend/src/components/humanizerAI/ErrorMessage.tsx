import React from 'react'

const ErrorMessage = ({ error }: { error: string }) => (
  <div className="my-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-400 dark:border-red-700">
    {error}
  </div>
)

export default ErrorMessage
