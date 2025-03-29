import SnippetsClient from '@/app/snippets/SnippetsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata for Snippets Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.snippets.title,
  description: pageMeta.snippets.description,
  image: pageMeta.snippets.image,
  keywords: pageMeta.snippets.keywords,
  url: `${PUBLIC_SITE_URL}/snippets`, // ✅ Snippets page URL
})

// ✅ Fetch snippets using API route (`/api/snippets`)
export default async function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainSnippetsPage />
    </Suspense>
  )
}

// ✅ Fetch Snippets Using API for Fresh Data
async function MainSnippetsPage() {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/snippets`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx` if no snippets found
  }

  const snippets = await res.json()
  return <SnippetsClient initialSnippets={snippets} />
}
