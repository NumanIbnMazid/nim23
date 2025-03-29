import ProjectsClient from '@/app/projects/ProjectsClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata for Projects Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.projects.title,
  description: pageMeta.projects.description,
  image: pageMeta.projects.image,
  keywords: pageMeta.projects.keywords,
  url: `${PUBLIC_SITE_URL}/projects`, // ✅ Projects page URL
})

// ✅ Fetch projects using API route (`/api/projects`)
export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainProjectsPage />
    </Suspense>
  )
}

// ✅ Fetch Projects Using API for Fresh Data
async function MainProjectsPage() {
  const res = await fetch(`${PUBLIC_SITE_URL}/api/projects`, {
    // cache: "no-store"
  })

  if (!res.ok) {
    return notFound() // ✅ Automatically redirects to `not-found.tsx` if no projects exist
  }

  const projects = await res.json()
  return <ProjectsClient initialProjects={projects} />
}
