import { FadeContainer } from '../content/FramerMotionVariants'
import { HomeHeading } from '.'
import React from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { YoutubeVideoType, MovieType } from '@lib/types'
import pageMeta from '@content/meta'
import Metadata from '@components/MetaData'
import PageTop from '@components/PageTop'
import Loader from '@components/Loader'
import NoData from "@components/NoData"
import { getAllMovies } from '@lib/backendAPI'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const YoutubeVideoFrame = dynamic(() => import('@components/YoutubeVideo'), {
  loading: () => <Loader />,
})

const MovieSection = dynamic(() => import('@components/Movies'), {
  loading: () => <Loader />,
})

export default function MediaSection() {
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [movies, setMovies] = useState<MovieType[]>([])

  const [youtubeFetchLoading, setYoutubeFetchLoading] = useState(true)
  const [moviesLoading, setMoviesLoading] = useState(true)

  const fetchMovies = async () => {
    const moviesData: MovieType[] = await getAllMovies()
    setMovies(moviesData)
    setMoviesLoading(false)
  }

  useEffect(() => {
    fetch('/api/youtube')
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error('API request failed')
        // }
        return response.json()
      })
      .then((data) => {
        setYoutubeVideos(data)
        setYoutubeFetchLoading(false)
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_error) => {
        // console.error('Error fetching YouTube videos:', error)
        setYoutubeFetchLoading(false)
      })
    // fetch movies
    fetchMovies()
  }, [])

  return (
    <>
      <Metadata
        title={pageMeta.media.title}
        description={pageMeta.media.description}
        previewImage={pageMeta.media.image}
        keywords={pageMeta.media.keywords}
      />

      <div className="pageTop relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <div className="p-4">
          <PageTop pageTitle={pageMeta.media.title}>{pageMeta.media.description}</PageTop>
        </div>

        {/* YouTube Videos */}
        {youtubeFetchLoading ? (
          // <Loader />
          null
        ) : youtubeVideos.length > 0 ? (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 ml-1 transition group-hover:translate-x-2"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
                ></path>
              </svg>
            </Link>
          </section>
        ) : null}
        {/* /YouTube Videos */}

        {/* Movies */}
        <HomeHeading title="Recent Watched Movies & TV Series" />
        {moviesLoading ? (
          <Loader />
        ) : movies && movies.length > 0 ? (
          <MovieSection movies={movies} showHomeHeading={false} />
        ) : (
          <NoData />
        )}
      </div>
    </>
  )
}
