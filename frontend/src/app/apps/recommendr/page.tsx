import RecommendrClient from '@/app/apps/recommendr/RecommendrClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const metadata: Metadata = getPageMetadata({
  title: pageMeta.recommendr.title,
  description: pageMeta.recommendr.description,
  image: pageMeta.recommendr.image,
  keywords: pageMeta.recommendr.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <RecommendrClient />
    </Suspense>
  )
}
