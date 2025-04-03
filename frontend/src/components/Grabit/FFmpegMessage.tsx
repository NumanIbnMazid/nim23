import React from 'react'

interface Props {
  messageRef: React.RefObject<HTMLParagraphElement>
}

const FFmpegMessage: React.FC<Props> = ({ messageRef }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto my-10">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="text-gray-700" ref={messageRef}></p>
      </div>
    </div>
  )
}

export default FFmpegMessage
