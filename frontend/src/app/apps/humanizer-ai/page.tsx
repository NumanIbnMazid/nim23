import HumanizerAiClient from '@/app/apps/humanizer-ai/HumanizerAiClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// Generate metadata for the landing page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.humanizerAI.title,
  description: pageMeta.humanizerAI.description,
  image: pageMeta.humanizerAI.image,
  keywords: pageMeta.humanizerAI.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HumanizerAiClient />
    </Suspense>
  )
}
