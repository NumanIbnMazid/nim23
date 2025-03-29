import { getPrivacyPolicy } from '@/lib/api/staticPages'
import PrivacyClient from '@/app/privacy/PrivacyClient'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// ✅ Generate metadata for Privacy Policy Page
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.privacy.title,
  description: pageMeta.privacy.description,
  image: pageMeta.privacy.image,
  keywords: pageMeta.privacy.keywords,
  url: `${PUBLIC_SITE_URL}/privacy`, // ✅ Privacy Policy page URL
})

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainPrivacyPage />
    </Suspense>
  )
}

async function MainPrivacyPage() {
  const privacyPolicy = await getPrivacyPolicy() // ✅ Server-side fetch for better performance

  return privacyPolicy && privacyPolicy.meta ? (
    <PrivacyClient privacyPolicy={{ ...privacyPolicy, meta: privacyPolicy.meta! }} />
  ) : (
    <div>Error loading privacy policy</div>
  ) // ✅ Pass data to the Client Component
}
