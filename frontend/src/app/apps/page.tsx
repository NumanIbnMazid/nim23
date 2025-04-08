import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import AppsClient from '@/app/apps/AppsPageClient'

// Revalidate every 60 seconds
export const revalidate = 60

// Generate metadata for the landing page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.home.title,
  description: pageMeta.home.description,
  image: pageMeta.home.image,
  keywords: pageMeta.home.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <AppsLandingPage />
    </Suspense>
  )
}

async function AppsLandingPage() {
  const apps = [
    {
      name: 'Grabit',
      link: '/apps/grabit',
      description: "Online Video Downloader and Audio Converter"
    },
  ]
  return <AppsClient apps={apps} />
}
