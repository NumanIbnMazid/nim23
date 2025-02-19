import { getBlogBySlug } from '@/lib/api/blogs/blogDetails'
import BlogDetailsClient from '@/app/blogs/[slug]/BlogDetailsClient'
import { notFound } from 'next/navigation'
import { getProfileInfo } from '@/lib/api/profileInfo'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params // ✅ Await params correctly
  const blog = await getBlogBySlug(slug)

  return getPageMetadata({
    title: blog?.title + ' - ' + pageMeta.blogDetails.title || pageMeta.blogDetails.title,
    description: blog?.overview ? blog.overview.replace(/<[^>]*>/g, '') : pageMeta.blogDetails.description,
    image: blog?.image || pageMeta.blogDetails.image,
    keywords: blog?.tags || pageMeta.blogDetails.keywords,
    url: blog?.slug ? `${PUBLIC_SITE_URL}/blogs/${blog.slug}` : PUBLIC_SITE_URL,
  })
}

export default async function BlogDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainBlogDetailsPage params={params} />
    </Suspense>
  )
}

async function MainBlogDetailsPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  const profileInfo = await getProfileInfo()
  if (!blog) return notFound()

  return <BlogDetailsClient blog={blog} profileInfo={profileInfo} />
}
