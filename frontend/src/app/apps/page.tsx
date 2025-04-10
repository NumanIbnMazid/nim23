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
  title: pageMeta.apps.title,
  description: pageMeta.apps.description,
  image: pageMeta.apps.image,
  keywords: pageMeta.apps.keywords,
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
      description: "A powerful online video and audio downloader that lets you easily download content from YouTube, Facebook, Instagram, Twitter, TikTok, and many more platforms. Fast, secure, and completely free to use."
    },
  ]
  return <AppsClient apps={apps} />
}
