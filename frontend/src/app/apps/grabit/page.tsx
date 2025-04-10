import GrabitClient from '@/app/apps/grabit/GrabitClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// Generate metadata for the landing page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.grabit.title,
  description: pageMeta.grabit.description,
  image: pageMeta.grabit.image,
  keywords: pageMeta.grabit.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <GrabitClient />
    </Suspense>
  )
}
