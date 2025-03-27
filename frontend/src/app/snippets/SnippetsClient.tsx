'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import PageTop from '@/components/PageTop'
import { pageMeta } from '@/lib/Meta'
import { CodeSnippetType } from '@/lib/types'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import en_US from 'rc-pagination/lib/locale/en_US'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/localStorage'
import '@/styles/pagination.css'

const SnippetCard = dynamic(() => import('@/components/SnippetCard'), {
  loading: () => <Loader />,
})

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_SNIPPETS_ITEMS_PER_PAGE) || 9

export default function SnippetsClient({ initialSnippets }: { initialSnippets: CodeSnippetType[] }) {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = Number(getLocalStorageItem('snippetCurrentPage', 1)) || 1
    return Math.min(savedPage, Math.ceil(initialSnippets.length / ITEMS_PER_PAGE)) || 1
  })

  const [paginatedSnippets, setPaginatedSnippets] = useState<CodeSnippetType[]>([])
  const [isSnippetsReady, setIsSnippetsReady] = useState(false) // Prevents pagination from appearing too soon
  const [showPagination, setShowPagination] = useState(false) // State to control when pagination should show

  useEffect(() => {
    setLocalStorageItem('snippetCurrentPage', currentPage)
  }, [currentPage])

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newSnippets = initialSnippets.slice(startIndex, endIndex)
    setPaginatedSnippets(newSnippets)

    // Only set setIsSnippetsReady to true when new snippets are ready
    if (newSnippets.length > 0) {
      setIsSnippetsReady(true)

      // Add delay to show pagination after a small timeout
      setTimeout(() => {
        setShowPagination(true)
      }, 300) // 300ms delay before showing pagination
    }
  }, [initialSnippets, currentPage])

  const totalItems = initialSnippets.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLocalStorageItem('snippetCurrentPage', page)
    setShowPagination(false) // Hide pagination when the page is being changed
    setIsSnippetsReady(false) // Hide snippets while new ones are being loaded
  }

  return (
    <>
      {initialSnippets.length > 0 ? (
        <section className="pageTop flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
          <PageTop pageTitle="Code Snippets" badge={initialSnippets.length.toString()}>
            {pageMeta.snippets.description}
          </PageTop>

          <section className="relative flex flex-col gap-2 min-h-[50vh]">
            {/* Show loader if projects are not ready */}
            {!isSnippetsReady && <Loader />}

            {isSnippetsReady && paginatedSnippets.length > 0 && (
              <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <AnimatePresence>
                  {paginatedSnippets.map((snippet, index) => (
                    <SnippetCard key={index} code_snippet={snippet} />
                  ))}
                </AnimatePresence>
              </AnimatedDiv>
            )}

            {/* Render pagination ONLY when snippets are fully loaded */}
            {showPagination && isSnippetsReady && (
              <div className="flex justify-center items-center mt-4">
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={ITEMS_PER_PAGE}
                  showTotal={(total) => `Total ${total} Code Snippets`}
                  showLessItems
                  onChange={handlePageChange}
                  showQuickJumper
                  locale={en_US}
                  className="custom-pagination"
                />
              </div>
            )}
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
