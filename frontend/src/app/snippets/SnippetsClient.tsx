'use client'

import { AnimatePresence } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import PageTop from '@/components/PageTop'
import { pageMeta } from '@/lib/Meta'
import { CodeSnippetType } from '@/lib/types'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'

const SnippetCard = dynamic(() => import('@/components/SnippetCard'), {
  loading: () => <Loader />,
})

export default function SnippetsClient({ initialSnippets }: { initialSnippets: CodeSnippetType[] }) {
  return (
    <>
      {initialSnippets.length > 0 ? (
        <section className="pageTop flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
          <PageTop pageTitle="Code Snippets" badge={initialSnippets.length.toString()}>
            {pageMeta.snippets.description}
          </PageTop>

          <section className="relative flex flex-col gap-2 min-h-[50vh]">
            <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <AnimatePresence>
                {initialSnippets.map((snippet, index) => (
                  <SnippetCard key={index} code_snippet={snippet} />
                ))}
              </AnimatePresence>
            </AnimatedDiv>
          </section>
        </section>
      ) : (
        <div className="mt-16">
          <NoData />
        </div>
      )}
    </>
  )
}
