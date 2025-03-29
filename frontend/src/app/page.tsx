import HomeClient from '@/app/HomeClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata for HomePage
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.home.title,
  description: pageMeta.home.description,
  image: pageMeta.home.image,
  keywords: pageMeta.home.keywords,
  url: PUBLIC_SITE_URL, // ✅ Homepage URL
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainHomePage />
    </Suspense>
  )
}

async function MainHomePage() {
  // ✅ Fetch all required data in parallel
  const [blogsRes, profileRes, experiencesRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/blogs?limit=2`, {
      // cache: 'no-store'
    }),
    fetch(`${PUBLIC_SITE_URL}/api/profile`, {
      // cache: 'no-store'
    }),
    fetch(`${PUBLIC_SITE_URL}/api/experiences?limit=1`, {
      // cache: 'no-store'
    }),
  ])

  if (!blogsRes.ok || !profileRes.ok || !experiencesRes.ok) {
    console.error('Failed to fetch homepage data')
    return notFound()
  }

  const [blogs, profileInfo, experiences] = await Promise.all([
    blogsRes.json(),
    profileRes.json(),
    experiencesRes.json(),
  ])

  return <HomeClient blogs={blogs} profileInfo={profileInfo} experiences={experiences} />
}
