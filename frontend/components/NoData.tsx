export default function NoData({ topic }: { topic: string }) {
  return (
    <div className="flex justify-center p-16">
      <div className="text-yellow-700 dark:text-yellow-600">
        <span className="font-extrabold text-lg">{topic} </span>
        Data not available!
      </div>
    </div>
  )
}
