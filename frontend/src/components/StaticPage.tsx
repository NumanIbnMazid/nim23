import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import MDXComponents from '@/components/MDXComponents'
import PageTop from '@/components/PageTop'
import { opacityVariant } from '@/content/FramerMotionVariants'
import { PageData, PostType } from '@/lib/types'
import { MDXRemote } from 'next-mdx-remote'

export default function StaticPage({
  metadata,
  page,
  showDescription = false,
}: {
  metadata: PageData
  page: PostType
  showDescription?: boolean
}) {
  return (
    <>
      <section className="pageTop bg-darkWhitePrimary dark:bg-darkPrimary">
        <PageTop containerClass="mb-0" pageTitle={page.meta.title}>
          {showDescription && (metadata.description || page.meta.excerpt)}
        </PageTop>
        <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
          <MDXRemote
            {...page.source}
            frontmatter={{
              slug: page.meta.slug,
              excerpt: page.meta.excerpt,
              title: page.meta.title,
              date: page.meta.date,
              keywords: page.meta.keywords,
              image: page.meta.image,
            }}
            components={MDXComponents}
          />
        </AnimatedDiv>
      </section>
    </>
  )
}
