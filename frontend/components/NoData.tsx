import { HomeHeading } from '../pages'

export default function NoData({ topic = undefined, allowSpacing = false, message=undefined }: { topic?: string; allowSpacing?: boolean; message?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${
        allowSpacing ? 'p-539' : 'pb-12'
      } relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl`}
    >
      <div className="flex flex-col items-center">
        {topic && <HomeHeading title={topic} />}
        <div className="font-bold text-amber-600 mt-7 text-lg">
          {message ? message : 'No data available!'}
        </div>
      </div>
    </div>
  )
}
