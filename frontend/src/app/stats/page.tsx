import StatsClient from '@/app/stats/StatsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata for Stats Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.stats.title,
  description: pageMeta.stats.description,
  image: pageMeta.stats.image,
  keywords: pageMeta.stats.keywords,
  url: `${PUBLIC_SITE_URL}/stats`, // ✅ Stats page URL
})

// ✅ Fetch stats using API route (`/api/github`)
export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainStatsPage />
    </Suspense>
  )
}

// ✅ Fetch GitHub Stats Using API for Fresh Data
async function MainStatsPage() {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/github`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx` if stats are missing
  }

  const githubStats = await res.json()
  return <StatsClient initialStats={githubStats} />
}