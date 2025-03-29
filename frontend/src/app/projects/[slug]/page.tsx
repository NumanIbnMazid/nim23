import ProjectDetailsClient from '@/app/projects/[slug]/ProjectDetailsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL, STATIC_SITE_URL } from '@/lib/constants'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min
// export const dynamic = "force-dynamic"; // Forces SSR but doesn't block rendering

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(`${STATIC_SITE_URL}/api/projects`)
  const projects = await res.json()

  return projects.map((project: { slug: string }) => ({ slug: project.slug }))
}

// ✅ Fetch metadata using API instead of `getProjectBySlug`
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params // ✅ Await params before using
  const res = await fetch(`${PUBLIC_SITE_URL}/api/projects/${slug}`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return getPageMetadata({
      title: pageMeta.projectDetails.title,
      description: pageMeta.projectDetails.description,
      image: pageMeta.projectDetails.image,
      keywords: pageMeta.projectDetails.keywords,
      url: PUBLIC_SITE_URL,
    })
  }

  const project = await res.json()

  return getPageMetadata({
    title: project ? `${project.title} - ${pageMeta.projectDetails.title}` : pageMeta.projectDetails.title,
    description: project?.short_description || pageMeta.projectDetails.description,
    image: project?.image || pageMeta.projectDetails.image,
    keywords: pageMeta.projectDetails.keywords,
    url: project?.slug ? `${PUBLIC_SITE_URL}/projects/${project.slug}` : PUBLIC_SITE_URL,
  })
}

// ✅ Fetch project using API route (`/api/projects/[slug]`)
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params // ✅ Await params before using

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainProjectDetailsPage params={params} />
    </Suspense>
  )
}

// ✅ Fetch Project Using API for Fresh Data
async function MainProjectDetailsPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/projects/${params.slug}`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx` if project is missing
  }

  const project = await res.json()
  return <ProjectDetailsClient project={project} />
}
