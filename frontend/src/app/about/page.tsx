import AboutClient from '@/app/about/AboutClient'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import { notFound } from 'next/navigation'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata using `pageMeta.about`
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.about.title,
  description: pageMeta.about.description,
  image: pageMeta.about.image,
  keywords: pageMeta.about.keywords,
  url: `${PUBLIC_SITE_URL}/about`,
})

// ✅ Fetch about data using API routes
export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainAboutPage />
    </Suspense>
  )
}

// ✅ Optimize API Calls: Reduce Concurrent Requests
async function MainAboutPage() {
  // ✅ Fetch first batch: experiences & skills
  const [experiencesRes, skillsRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/experiences`, {
      // cache: "no-store"
    }),
    fetch(`${PUBLIC_SITE_URL}/api/skills`, {
      // cache: "no-store"
    }),
  ])

  if (!experiencesRes.ok || !skillsRes.ok) {
    return notFound()
  }

  const [experiences, skills] = await Promise.all([experiencesRes.json(), skillsRes.json()])

  // ✅ Fetch second batch: educations, certificates, interests
  const [educationsRes, certificatesRes, interestsRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/educations`, {
      // cache: "no-store"
    }),
    fetch(`${PUBLIC_SITE_URL}/api/certificates`, {
      // cache: "no-store"
    }),
    fetch(`${PUBLIC_SITE_URL}/api/interests`, {
      // cache: "no-store"
    }),
  ])

  if (!educationsRes.ok || !certificatesRes.ok || !interestsRes.ok) {
    return notFound()
  }

  const [educations, certificates, interests] = await Promise.all([
    educationsRes.json(),
    certificatesRes.json(),
    interestsRes.json(),
  ])

  return (
    <AboutClient
      experiences={experiences}
      skills={skills}
      educations={educations}
      certificates={certificates}
      interests={interests}
    />
  )
}