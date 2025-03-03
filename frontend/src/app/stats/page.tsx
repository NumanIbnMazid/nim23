import { getGithubStats } from '@/lib/api/github'
import StatsClient from '@/app/stats/StatsClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for Stats Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.stats.title,
  description: pageMeta.stats.description,
  image: pageMeta.stats.image,
  keywords: pageMeta.stats.keywords,
  url: `${PUBLIC_SITE_URL}/stats`, // ✅ Stats page URL
})

export default function StatsPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainStatsPage />
    </Suspense>
  )
}

async function MainStatsPage() {
  const githubStats = await getGithubStats() // ✅ Server-side fetch for better performance

  return <StatsClient initialStats={githubStats} /> // ✅ Pass stats to the Client Component
}
