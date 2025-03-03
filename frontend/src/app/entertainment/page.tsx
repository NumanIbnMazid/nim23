import { getAllMovies } from '@/lib/api/movies'
import { getYoutubeVideos } from '@/lib/api/youtube'
import MediaClient from './EntertainmentClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for Media Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.entertainment.title,
  description: pageMeta.entertainment.description,
  image: pageMeta.entertainment.image,
  keywords: pageMeta.entertainment.keywords,
  url: `${PUBLIC_SITE_URL}/media`, // ✅ Media page URL
})

export default function MediaPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainMediaPage />
    </Suspense>
  )
}

async function MainMediaPage() {
  const movies = await getAllMovies() // ✅ Server-side fetch for better performance
  const youtubeVideos = await getYoutubeVideos() // ✅ Server-side fetch for YouTube videos

  return <MediaClient initialMovies={movies} initialYoutubeVideos={youtubeVideos} /> // ✅ Pass data to the Client Component
}
