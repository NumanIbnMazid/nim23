import Image from 'next/image'
import ShareOnSocialMedia from '../components/ShareOnSocialMedia'
import { FiPrinter } from 'react-icons/fi'
// import Newsletter from '../components/Newsletter'
import useWindowLocation from '@hooks/useWindowLocation'
import ScrollProgressBar from '@components/ScrollProgressBar'
import { useState, useEffect } from 'react'
import { opacityVariant, popUp } from '@content/FramerMotionVariants'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import { getFormattedDate } from '@utils/date'
import { BlogType, ProfileType } from '@lib/types'
import TableOfContents from '@components/TableOfContents'
import cn from 'classnames'
import Prism from '../prismSetup'
import { motion } from 'framer-motion'
import readTime from "reading-time"

export default function BlogLayout({ blog, profileInfo }: { blog: BlogType, profileInfo: ProfileType}) {
  const { currentURL } = useWindowLocation()
  const [isTOCActive, setIsTOCActive] = useState(false)
  const hasCode = blog && blog.content.includes('<code>')
  const readingTime = readTime(blog.content)

  const injectStyle = () => {
    if (hasCode) {
      const style = document.createElement('style')
      style.innerHTML = `
        .text-code code {
          color: #5292a1
        }
      `
      document.head.appendChild(style)
    }
  }

  useEffect(() => {
    // Syntax Highlighting
    injectStyle()
    // Prism JS
    if (typeof window !== 'undefined') {
      Prism.highlightAll()
      Prism.plugins.lineNumbers = true
    }
  }, [hasCode])

  return (
    <section className="mt-[44px] md:mt-[60px] relative !overflow-hidden">
      {/* TOC */}
      {blog.table_of_contents.length > 0 && (
        <TableOfContents
          isTOCActive={isTOCActive}
          setIsTOCActive={setIsTOCActive}
          tableOfContents={blog.table_of_contents}
        />
      )}

      {/* Blog Content */}
      <section
        className="p-5 sm:pt-10 relative font-barlow prose dark:prose-invert md:ml-[30%] lg:ml-[30%] print:!mx-auto bg-darkWhitePrimary dark:bg-darkPrimary"
        style={{
          maxWidth: '900px',
          opacity: `${isTOCActive} && "0.3"`,
          margin: `${blog.table_of_contents.length <= 0} && "auto"`,
        }}
      >
        <ScrollProgressBar />
        {/* Blog Cover Image */}
        <div className="flex items-center justify-center mb-4">
          <Image
            alt={blog.title}
            width={1000}
            height={1000}
            quality={50}
            style={{ width: 'auto', height: 'auto' }}
            src={blog.image}
            className="rounded-xl shadow filter !m-0"
          />
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white mt-10">{blog.title}</h1>

        <div className="!w-full text-gray-700 dark:text-gray-300">
          <div className="w-full">
            {blog.author === 'Numan Ibn Mazid' && profileInfo.image !== null && (
              <motion.div
                variants={popUp}
                className="relative flex items-center justify-center p-3 rounded-full overflow-hidden w-44 h-44 xs:w-30 xs:h-30 before:absolute before:inset-0 before:border-t-4 before:border-b-4 before:border-black before:dark:border-white before:rounded-full before:animate-photo-spin"
              >
                <Image
                  src={profileInfo.image}
                  className="rounded-full shadow filter"
                  width={933}
                  height={933}
                  alt="cover Profile Image"
                  quality={100}
                />
              </motion.div>
            )}
            <div className="mt-2">
              <span className="text-base text-gray-500">Author: </span>
              <span className="font-bold text-base text-gray-600 dark:text-gray-400">{blog.author}</span>
            </div>

            <div className="mt-2 text-base text-gray-500">
              <span>Created at: </span>
              <span className="font-bold">{getFormattedDate(new Date(blog.created_at))}</span>
            </div>

            {getFormattedDate(new Date(blog.created_at)) !== getFormattedDate(new Date(blog.updated_at)) && (
              <div className="text-base text-gray-500 mb-2">
                <span>Last Update: </span>
                <span className="font-bold">{getFormattedDate(new Date(blog.updated_at))}</span>
              </div>
            )}

            {blog.category && (
              <div className="text-base text-gray-500 mb-2">
                <span>Category: </span>
                <span className="font-bold">{blog.category.name}</span>
              </div>
            )}

            <div className="text-base text-gray-500">
              <span>Reading Time: </span>
              <span className="font-bold">{readingTime.text}</span>
            </div>

            <div className="text-base text-gray-500 mb-3">
              <span>Total Words: </span>
              <span className="font-bold">{readingTime.words}</span>
            </div>

            {blog.overview && (
              <div className="text-base text-gray-500 mb-3">
                <span>Overview: </span>
                <span className="font-bold">{blog.overview}</span>
              </div>
            )}

            {blog.tags && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-base text-gray-500">Tags: </span>
                {blog.tags.split(',').map((tag, index) => {
                  return (
                    <span key={`${tag}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                      {tag.toLowerCase()}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="relative flex mt-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-700 dark:text-gray-400">Content</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* Blog Content */}

        <AnimatedDiv
          variants={opacityVariant}
          className="max-w-full prose-sm blog-container sm:prose-base prose-pre:bg-white prose-img:mx-auto prose-img:rounded-md dark:prose-pre:bg-darkSecondary prose-pre:saturate-150 dark:prose-pre:saturate-100 marker:text-black dark:marker:text-white"
        >
          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className={cn('my-4', { 'text-code': hasCode, 'line-numbers': hasCode })}
          />
        </AnimatedDiv>

        {/* NewsLetter */}
        {/* <Newsletter /> */}

        {/* Social Media */}
        <div className="flex flex-col items-center w-full gap-4 my-10 print:hidden">
          <h3 style={{ margin: '0' }} className="text-xl font-semibold dark:text-white">
            Share
          </h3>
          <ShareOnSocialMedia
            className="flex flex-wrap items-center gap-2 w-fit"
            title={blog.title}
            url={currentURL}
            summary={blog.overview || blog.title}
            cover_image={blog.image}
          >
            <div className="p-2 text-white bg-gray-700 rounded-full cursor-pointer hover:bg-cyan-700">
              <FiPrinter className="w-4 h-4" onClick={() => window.print()} />
            </div>
          </ShareOnSocialMedia>
        </div>
      </section>
    </section>
  )
}
