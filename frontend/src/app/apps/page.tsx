import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import AppsClient from '@/app/apps/AppsPageClient'
import { FaDownload, FaUserEdit, FaMagic } from 'react-icons/fa'

// Revalidate every 60 seconds
export const revalidate = 60

// Generate metadata for the landing page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.apps.title,
  description: pageMeta.apps.description,
  image: pageMeta.apps.image,
  keywords: pageMeta.apps.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <AppsLandingPage />
    </Suspense>
  )
}

async function AppsLandingPage() {
  const apps = [
    {
      name: 'Grabit',
      link: '/apps/grabit',
      description: pageMeta.grabit.description,
      icon: <FaDownload className="text-green-500 text-4xl" />,
    },
    {
      name: 'Humanizer AI',
      link: '/apps/humanizer-ai',
      description: pageMeta.humanizerAI.description,
      icon: <FaUserEdit className="text-purple-500 text-4xl" />,
    },
    {
      name: 'Recommendr',
      link: '/apps/recommendr',
      description: pageMeta.recommendr.description,
      icon: <FaMagic className="text-purple-500 text-4xl" />,
    },
  ]
  return <AppsClient apps={apps} />
}
