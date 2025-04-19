import RecommendrClient from '@/app/apps/recommendr/RecommendrClient'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import { getPreferences } from '@/lib/recommendr/fetchPreferences'

export const metadata: Metadata = getPageMetadata({
  title: pageMeta.recommendr.title,
  description: pageMeta.recommendr.description,
  image: pageMeta.recommendr.image,
  keywords: pageMeta.recommendr.keywords,
  url: PUBLIC_SITE_URL,
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainPage />
    </Suspense>
  )
}

// ✅ Fetch Movies & YouTube Videos Using API for Fresh Data
async function MainPage() {
  try {
    const recommenderPreferences = await getPreferences()
    return <RecommendrClient preferencesChoices={recommenderPreferences} />
  } catch (error) {
    console.error('Error fetching recommender preferences choices:', error)
    return notFound()
  }
}
