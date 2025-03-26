'use client' // ✅ Mark as a Client Component

import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeContainer, popUpFromBottomForText, searchBarSlideAnimation } from '@/content/FramerMotionVariants'
import { RiCloseCircleLine } from 'react-icons/ri'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import PageTop from '@/components/PageTop'
import { CgSearch } from 'react-icons/cg'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'
import { BlogType } from '@/lib/types'
import { FaList, FaTh } from 'react-icons/fa'
import Pagination from 'rc-pagination' // Import rc-pagination
import 'rc-pagination/assets/index.css' // Import CSS
import en_US from 'rc-pagination/lib/locale/en_US'
import '@/styles/pagination.css'
import BlogGridView from '@/components/BlogGridView'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/localStorage'

const Blog = dynamic(() => import('@/components/Blog'), {
  loading: () => <Loader />,
})

// Pagnation
const GRID_ITEMS_PER_PAGE = 9
const LIST_ITEMS_PER_PAGE = 5

export default function BlogsClient({ initialBlogs }: { initialBlogs: BlogType[] }) {
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLInputElement>(null!)

  // Use localStorage for isGridView
  const [isGridView, setIsGridView] = useState<boolean>(() => {
    return getLocalStorageItem('isGridView', false) === true
  })

  useEffect(() => {
    setLocalStorageItem('isGridView', isGridView)
  }, [isGridView])

  const toggleGridView = () => {
    setIsGridView((prev) => !prev) // Toggle the state
  }

  // Dynamically set ITEMS_PER_PAGE based on isGridView
  const ITEMS_PER_PAGE = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE

  // Filtering and pagination
  const filteredBlogs = initialBlogs.filter((post) =>
    post.title.toLowerCase().includes(searchValue.trim().toLowerCase())
  )

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = Number(getLocalStorageItem('snippetCurrentPage', 1)) || 1
    // Make sure that saved page is less than total pages if total pages less then savedPages
    return Math.min(savedPage, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)) || 1
  })

  useEffect(() => {
    setLocalStorageItem('blogCurrentPage', currentPage)
  }, [currentPage])

  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalItems = filteredBlogs.length

  // Invoke when user click to request another page.
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLocalStorageItem('currentPage', page) //update localStorage
  }

  useEffect(() => {
    function handleAutoSearch(e: KeyboardEvent) {
      if (e.code === 'Slash' && e.ctrlKey) {
        searchRef.current.focus()
      }
    }
    document.addEventListener('keydown', handleAutoSearch)
    return () => document.removeEventListener('keydown', handleAutoSearch)
  }, [])

  return (
    <>
      <section className="pageTop flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
        <PageTop pageTitle="Blogs" badge={initialBlogs.length.toString()}>
          Welcome to my blog page! Here, you will find a collection of insightful and informative articles that I have
          written on various topics. Till now, I've written {initialBlogs.length} articles.
        </PageTop>

        <AnimatedDiv
          className="relative group w-0 mx-auto text-slate-400 dark:text-gray-300 bg-white dark:bg-darkSecondary rounded-md"
          variants={searchBarSlideAnimation}
        >
          <CgSearch className="ml-3 w-5 h-5 absolute top-[50%] -translate-y-1/2 z-10" />
          <input
            ref={searchRef}
            className="px-12 py-3 w-full outline-none transition duration-200 bg-transparent font-medium font-inter lg:flex items-center text-sm leading-6 text-slate-400 rounded-md ring-1 ring-slate-900/10 shadow-sm hover:ring-slate-400 dark:highlight-white/5 dark:hover:bg-darkSecondary/90 mx-auto flex relative group focus:ring-slate-400"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Press (CTRL + /) to search... "
          />
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="hidden group-focus-within:inline-flex right-3 absolute top-[50%] -translate-y-1/2"
          >
            <RiCloseCircleLine className="w-5 h-5 mr-3" />
          </button>
        </AnimatedDiv>

        <section className="relative py-5 flex flex-col gap-2 min-h-[50vh]">
          <AnimatePresence>
            {filteredBlogs.length !== 0 ? (
              <>
                <AnimatedDiv variants={FadeContainer} className="flex items-center justify-between">
                  <motion.h3
                    variants={popUpFromBottomForText}
                    className="text-left font-bold text-2xl sm:text-3xl my-5"
                  >
                    All Posts ({filteredBlogs.length})
                  </motion.h3>
                  {/* Grid View Toggle Button */}
                  <button
                    onClick={toggleGridView}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isGridView ? <FaList size={20} /> : <FaTh size={20} />}
                  </button>
                </AnimatedDiv>

                <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 gap-4">
                  {isGridView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginatedBlogs.map((blog, index) => (
                        <BlogGridView key={index} blog={blog} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedBlogs.map((blog, index) => (
                        <Blog key={index} blog={blog} />
                      ))}
                    </div>
                  )}
                </AnimatedDiv>

                {/* Pagination Controls */}
                {/* rc-pagination */}
                <div className="flex justify-center items-center mt-4">
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={ITEMS_PER_PAGE}
                    showTotal={(total) => `Total ${total} Blogs`}
                    showLessItems
                    onChange={handlePageChange}
                    showQuickJumper
                    locale={en_US}
                    className="custom-pagination"
                  />
                </div>
              </>
            ) : (
              <NoData /> // ✅ Show NoData when no blogs found
            )}
          </AnimatePresence>
        </section>
      </section>
    </>
  )
}
