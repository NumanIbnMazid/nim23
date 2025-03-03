import { HomeHeading } from '@/app/HomeClient'

export default function Loader({ topic }: { topic?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      <div className="flex flex-col items-center">
        {topic && <HomeHeading title={topic} />}

        {/* Modern Animated Loader */}
        <div className="relative flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-transparent border-t-gray-600 dark:border-t-white rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 border-4 border-transparent border-b-gray-400 dark:border-b-gray-200 rounded-full animate-spin-reverse"></div>
        </div>

        <span className="mt-4 font-semibold text-gray-700 dark:text-gray-300">Loading, please wait...</span>
      </div>
    </div>
  )
}
