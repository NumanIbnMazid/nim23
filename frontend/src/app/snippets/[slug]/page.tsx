import SnippetDetailsClient from '@/app/snippets/[slug]/SnippetDetailsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min
// export const dynamic = "force-dynamic"; // Forces SSR but doesn't block rendering

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/snippets`)
  const snippets = await res.json()

  return snippets.map((snippet: { slug: string }) => ({ slug: snippet.slug }))
}

// ✅ Fetch metadata using API instead of `getSnippetBySlug`
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params // ✅ Await params before using
  const res = await fetch(`${PUBLIC_SITE_URL}/api/snippets/${slug}`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return getPageMetadata({
      title: pageMeta.snippetDetails.title,
      description: pageMeta.snippetDetails.description,
      image: pageMeta.snippetDetails.image,
      keywords: pageMeta.snippetDetails.keywords,
      url: PUBLIC_SITE_URL,
    })
  }

  const snippet = await res.json()

  return getPageMetadata({
    title: snippet ? `${snippet.title} - ${pageMeta.snippetDetails.title}` : pageMeta.snippetDetails.title,
    description: snippet?.overview || pageMeta.snippetDetails.description,
    image: snippet?.image || pageMeta.snippetDetails.image,
    keywords: snippet?.tags || pageMeta.snippetDetails.keywords,
    url: snippet?.slug ? `${PUBLIC_SITE_URL}/snippets/${snippet.slug}` : PUBLIC_SITE_URL,
  })
}

// ✅ Fetch snippet using API route (`/api/snippets/[slug]`)
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params // ✅ Await params before using

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainSnippetDetailsPage params={params} />
    </Suspense>
  )
}

// ✅ Fetch Snippet Using API for Fresh Data
async function MainSnippetDetailsPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/snippets/${params.slug}`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx` if snippet is missing
  }

  const snippet = await res.json()
  return <SnippetDetailsClient snippet={snippet} />
}