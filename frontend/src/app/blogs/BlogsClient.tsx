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

const Blog = dynamic(() => import('@/components/Blog'), {
  loading: () => <Loader />,
})

export default function BlogsClient({ initialBlogs }: { initialBlogs: BlogType[] }) {
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    function handleAutoSearch(e: KeyboardEvent) {
      if (e.code === 'Slash' && e.ctrlKey) {
        searchRef.current.focus()
      }
    }
    document.addEventListener('keydown', handleAutoSearch)
    return () => document.removeEventListener('keydown', handleAutoSearch)
  }, [])

  // ✅ Use `initialBlogs` directly (no need for `setBlogs`)
  const filteredBlogs = initialBlogs.filter((post) =>
    post.title.toLowerCase().includes(searchValue.trim().toLowerCase())
  )

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
                </AnimatedDiv>

                <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 gap-4">
                  {filteredBlogs.map((blog, index) => {
                    return <Blog key={index} blog={blog} />
                  })}
                </AnimatedDiv>
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
