import { getAllSnippets } from '@/lib/api/snippets/snippets'
import SnippetsClient from '@/app/snippets/SnippetsClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for Snippets Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.snippets.title,
  description: pageMeta.snippets.description,
  image: pageMeta.snippets.image,
  keywords: pageMeta.snippets.keywords,
  url: `${PUBLIC_SITE_URL}/snippets`, // ✅ Snippets page URL
})

export default function SnippetsPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainSnippetsPage />
    </Suspense>
  )
}

async function MainSnippetsPage() {
  const snippets = await getAllSnippets() // ✅ Server-side fetch for better performance

  return <SnippetsClient initialSnippets={snippets} /> // ✅ Pass snippets to the Client Component
}
