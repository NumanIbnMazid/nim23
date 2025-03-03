import { YoutubeVideoType } from '@/lib/types'

export default function YoutubeVideoFrame({ yt_video }: { yt_video: YoutubeVideoType }) {
  return (
    <div className="w-full p-4 bg-white dark:bg-darkSecondary ring-1 hover:bg-darkWhite dark:hover:bg-darkFourth dark:hover:ring-[#555] ring-gray-300 hover:ring-gray-400 dark:ring-[#444] flex flex-col gap-2 rounded">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${yt_video.id.videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
