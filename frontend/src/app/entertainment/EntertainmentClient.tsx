'use client'

import { FadeContainer } from '@/content/FramerMotionVariants'
import { HomeHeading } from '@/app/HomeClient'
import React, { useState } from 'react'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import { AnimatePresence } from 'framer-motion'
import { YoutubeVideoType, MovieType } from '@/lib/types'
import { pageMeta } from '@/lib/Meta'
import PageTop from '@/components/PageTop'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const YoutubeVideoFrame = dynamic(() => import('@/components/YoutubeVideo'), {
  loading: () => <Loader />,
})

const MovieSection = dynamic(() => import('@/components/Movies'), {
  loading: () => <Loader />,
})

export default function EntertainmentClient({
  initialMovies,
  initialYoutubeVideos,
}: {
  initialMovies: MovieType[]
  initialYoutubeVideos: YoutubeVideoType[]
}) {
  const [youtubeVideos] = useState(initialYoutubeVideos)
  const [movies] = useState(initialMovies)

  return (
    <>
      <div className="pageTop relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100">
        <PageTop pageTitle="Entertainment">{pageMeta.entertainment.description}</PageTop>
        {youtubeVideos.length > 0 ? (
          <section className="flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
            <HomeHeading title="YouTube Videos" />
            <section className="relative flex flex-col gap-2 min-h-[50vh] mt-5 print:hidden">
              <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <AnimatePresence>
                  {youtubeVideos.map((video: YoutubeVideoType, index: number) => (
                    <div key={index}>
                      <YoutubeVideoFrame yt_video={video} />
                    </div>
                  ))}
                </AnimatePresence>
              </AnimatedDiv>
            </section>
            <Link
              href="https://www.youtube.com/@NumanIbnMazid/videos"
              target="_blank"
              className="p-6 mb-6 hover:text-slate-500 flex items-center justify-center gap-1 font-medium transition border-transparent font-inter active:scale-95 active:border-black w-fit group"
            >
              View all YouTube videos on my channel
            </Link>
          </section>
        ) : null}
        <HomeHeading title="Recent Watched Movies & TV Series" />
        {movies.length > 0 ? <MovieSection movies={movies} showHomeHeading={false} /> : <NoData />}
      </div>
    </>
  )
}
