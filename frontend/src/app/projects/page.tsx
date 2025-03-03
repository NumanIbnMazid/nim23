import { getAllProjects } from '@/lib/api/projects/projects'
import ProjectsClient from '@/app/projects/ProjectsClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for Projects Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.projects.title,
  description: pageMeta.projects.description,
  image: pageMeta.projects.image,
  keywords: pageMeta.projects.keywords,
  url: `${PUBLIC_SITE_URL}/projects`, // ✅ Projects page URL
})

export default async function ProjectsPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainProjectsPage />
    </Suspense>
  )
}

async function MainProjectsPage() {
  const projects = await getAllProjects() // ✅ Server-side fetch for better performance

  return <ProjectsClient initialProjects={projects} /> // ✅ Pass projects to the Client Component
}
