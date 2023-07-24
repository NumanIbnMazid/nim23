import { HomeHeading } from '../pages'

export default function NoData({ topic = undefined, allowSpacing = false }: { topic?: string; allowSpacing?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center ${
        allowSpacing ? 'p-539' : 'pb-12'
      } relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl`}
    >
      <div className="flex flex-col items-center">
        {topic && <HomeHeading title={topic} />}
        <div className="font-bold text-amber-600 mt-7 text-lg">Data not available!</div>
      </div>
    </div>
  )
}
