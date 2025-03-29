import BlogDetailsClient from '@/app/blogs/[slug]/BlogDetailsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL, STATIC_SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min
// export const dynamic = "force-dynamic"; // Forces SSR but doesn't block rendering

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(`${STATIC_SITE_URL}/api/blogs`)
  const blogs = await res.json()

  return blogs.map((blog: { slug: string }) => ({ slug: blog.slug }))
}

// ✅ Fix: `params` should be awaited before using
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params // ✅ Await params before using
  const res = await fetch(`${PUBLIC_SITE_URL}/api/blogs/${slug}`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return getPageMetadata({
      title: pageMeta.blogDetails.title,
      description: pageMeta.blogDetails.description,
      image: pageMeta.blogDetails.image,
      keywords: pageMeta.blogDetails.keywords,
      url: PUBLIC_SITE_URL,
    })
  }

  const blog = await res.json()

  return getPageMetadata({
    title: blog ? `${blog.title} - ${pageMeta.blogDetails.title}` : pageMeta.blogDetails.title,
    description: blog?.overview ? blog.overview.replace(/<[^>]*>/g, '') : pageMeta.blogDetails.description,
    image: blog?.image || pageMeta.blogDetails.image,
    keywords: blog?.tags || pageMeta.blogDetails.keywords,
    url: blog?.slug ? `${PUBLIC_SITE_URL}/blogs/${blog.slug}` : PUBLIC_SITE_URL,
  })
}

// ✅ Fix: `params` should be awaited
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params // ✅ Await params correctly

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainBlogDetailsPage params={params} />
    </Suspense>
  )
}

// ✅ Fetch Blog & Profile Info in Parallel for Faster Performance
async function MainBlogDetailsPage({ params }: { params: { slug: string } }) {
  const [blogRes, profileRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/blogs/${params.slug}`, {
      // cache: 'no-store'
    }),
    fetch(`${PUBLIC_SITE_URL}/api/profile`, {
      // cache: 'no-store'
    }),
  ])

  if (!blogRes.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx`
  }

  const [blog, profileInfo] = await Promise.all([blogRes.json(), profileRes.json()])

  return <BlogDetailsClient blog={blog} profileInfo={profileInfo} />
}
