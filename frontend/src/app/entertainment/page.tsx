import MediaClient from './EntertainmentClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// revalidate all fetch requests in a route segment
export const revalidate = 300 // revalidate at 5 min

// ✅ Generate metadata for Media Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.entertainment.title,
  description: pageMeta.entertainment.description,
  image: pageMeta.entertainment.image,
  keywords: pageMeta.entertainment.keywords,
  url: `${PUBLIC_SITE_URL}/media`, // ✅ Media page URL
})

// ✅ Fetch media data using API routes
export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainMediaPage />
    </Suspense>
  )
}

// ✅ Fetch Movies & YouTube Videos Using API for Fresh Data
async function MainMediaPage() {
  const [moviesRes, youtubeRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/movies`, {
      // cache: 'no-store'
    }),
    fetch(`${PUBLIC_SITE_URL}/api/youtube`, {
      // cache: 'no-store'
    }),
  ])

  if (!moviesRes.ok || !youtubeRes.ok) {
    return notFound() // ✅ Redirect to `not-found.tsx` if any API fails
  }

  const [movies, youtubeVideos] = await Promise.all([moviesRes.json(), youtubeRes.json()])

  return <MediaClient initialMovies={movies} initialYoutubeVideos={youtubeVideos} />
}