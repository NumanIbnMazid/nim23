import { getAllBlogs } from '@/lib/api/blogs/blogs'
import HomeClient from '@/app/HomeClient'
import { getProfileInfo } from '@/lib/api/profileInfo'
import { getAllExperiences } from '@/lib/api/experiences'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for HomePage
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.home.title,
  description: pageMeta.home.description,
  image: pageMeta.home.image,
  keywords: pageMeta.home.keywords,
  url: PUBLIC_SITE_URL, // ✅ Homepage URL
})

export default async function Home() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainHomePage />
    </Suspense>
  )
}

async function MainHomePage() {
  const blogs = await getAllBlogs(2)
  const profileInfo = await getProfileInfo()
  const experiences = await getAllExperiences(1)

  return <HomeClient blogs={blogs} profileInfo={profileInfo} experiences={experiences} />
}
