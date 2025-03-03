import MDXContent from '@/lib/MDXContent'
import { getAllExperiences } from '@/lib/api/experiences'
import { getAllSkills } from '@/lib/api/skills'
import { getAllCertificates } from '@/lib/api/certificates'
import { getAllInterests } from '@/lib/api/interests'
import { getAllEducations } from '@/lib/api/educations'
import AboutClient from './AboutClient'
import { PostType, FrontMatter } from '@/lib/types'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import { Suspense } from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

/**
 * Default About Metadata if `meta` is not found.
 */
const DEFAULT_META: FrontMatter = {
  slug: 'about',
  readingTime: { text: '0 min read', minutes: 0, time: 0, words: 0 },
  excerpt: 'About me page.',
  title: pageMeta.about.title,
  date: new Date().toISOString(),
  keywords: pageMeta.about.keywords,
  image: pageMeta.about.image,
  url: `${PUBLIC_SITE_URL}/about`,
  description: pageMeta.about.description,
}

// ✅ Generate metadata using `pageMeta.about`
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.about.title,
  description: pageMeta.about.description,
  image: pageMeta.about.image,
  keywords: pageMeta.about.keywords,
  url: `${PUBLIC_SITE_URL}/about`,
})

export default async function AboutPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainAboutPage />
    </Suspense>
  )
}

async function MainAboutPage() {
  const aboutData = await new MDXContent('src/static_pages').getPostFromSlug('about')

  // ✅ Ensure `aboutData.post` is never null
  const about: PostType = {
    source: aboutData?.post?.source ?? { compiledSource: '', scope: {}, frontmatter: {} },
    tableOfContents: aboutData?.post?.tableOfContents ?? [],
    meta: aboutData?.post?.meta
      ? { ...aboutData.post.meta, description: aboutData.post.meta.description ?? DEFAULT_META.description }
      : DEFAULT_META,
  }

  const experiences = await getAllExperiences()
  const skills = await getAllSkills()
  const educations = await getAllEducations()
  const certificates = await getAllCertificates()
  const interests = await getAllInterests()

  return (
    <AboutClient
      about={about}
      experiences={experiences}
      skills={skills}
      educations={educations}
      certificates={certificates}
      interests={interests}
    />
  )
}
