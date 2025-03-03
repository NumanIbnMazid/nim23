import { getSnippetBySlug } from '@/lib/api/snippets/snippetDetails'
import SnippetDetailsClient from '@/app/snippets/[slug]/SnippetDetailsClient'
import { notFound } from 'next/navigation'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params // ✅ Await params correctly
  const snippet = await getSnippetBySlug(slug)

  return getPageMetadata({
    title: snippet?.title + " - " + pageMeta.snippetDetails.title || pageMeta.snippetDetails.title,
    description: snippet?.overview || pageMeta.snippetDetails.description,
    image: snippet?.image || pageMeta.snippetDetails.image,
    keywords: snippet?.tags || pageMeta.snippetDetails.keywords,
    url: snippet?.slug ? `${PUBLIC_SITE_URL}/snippets/${snippet.slug}` : PUBLIC_SITE_URL,
  })
}

export default async function SnippetDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainSnippetDetailsPage params={params} />
    </Suspense>
  )
}

async function MainSnippetDetailsPage({ params }: { params: { slug: string } }) {
  const snippet = await getSnippetBySlug(params.slug)
  if (!snippet) return notFound() // ✅ Handle 404 scenario

  return <SnippetDetailsClient snippet={snippet} /> // ✅ Pass snippet data
}
