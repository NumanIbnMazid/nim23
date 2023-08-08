import { FadeContainer } from '../content/FramerMotionVariants'
import { HomeHeading } from '.'
import React from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import YoutubeVideoFrame from '@components/YoutubeVideo'
import { YoutubeVideoType } from '@lib/types'
import pageMeta from '@content/meta'
import Metadata from '@components/MetaData'
import PageTop from '@components/PageTop'
import Loader from '@components/Loader'
import NoData from "@components/NoData"


export default function MediaSection() {
  const [youtubeVideos, setYoutubeVideos] = useState([])

  const [youtubeFetchLoading, setYoutubeFetchLoading] = useState(true)

  useEffect(() => {
    fetch('/api/youtube')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed')
        }
        return response.json()
      })
      .then((data) => {
        setYoutubeVideos(data)
        setYoutubeFetchLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching YouTube videos:', error)
        setYoutubeFetchLoading(false)
      })
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
        <section className="flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
          <HomeHeading title="YouTube Videos" />

          <section className="relative flex flex-col gap-2 min-h-[50vh]">
            {youtubeFetchLoading ? (
              <Loader />
            ) : youtubeVideos.length > 0 ? (
              <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <AnimatePresence>
                  {youtubeVideos.map((video: YoutubeVideoType, index: number) => (
                    <div key={index}>
                      <YoutubeVideoFrame yt_video={video} />
                    </div>
                  ))}
                </AnimatePresence>
              </AnimatedDiv>
            ) : (
              <NoData />
            )}
          </section>
        </section>
        {/* /YouTube Videos */}

      </div>
    </>
  )
}
