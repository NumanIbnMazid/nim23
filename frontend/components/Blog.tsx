import Link from 'next/link'
import { getFormattedDate } from '@utils/date'
import { BlogType } from '@lib/types'
import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BlogCardAnimation } from '@content/FramerMotionVariants'
import readTime from "reading-time"

export default function Blog({ blog, animate = false }: { blog: BlogType; animate?: boolean }) {
  const blogRef = useRef(null)
  const readingTime = readTime(blog.content)

  return (
    <motion.article
      ref={blogRef}
      variants={BlogCardAnimation}
      initial={animate && 'hidden'}
      whileInView={animate ? 'visible' : ''}
      viewport={{ once: true }}
      className="bg-white dark:bg-darkSecondary rounded-2xl p-2 flex flex-col sm:flex-row items-center w-ull sm:w-[95%] mx-auto gap-2 md:gap-7 shadow-md md:shadow-lg"
    >
      <div className="">
        <Image
          title={blog.title}
          alt={blog.title}
          src={blog.image}
          width={1200}
          height={600}
          blurDataURL={blog.image}
          quality={50}
          className="my-auto transition-all duration-300 backdrop-blur-xl rounded-xl w-full"
        />
      </div>

      <div className="flex flex-col w-full h-full px-2 pb-2 mt-2 sm:mt-0 sm:p-1 lg:py-5 md:pr-5">
        <Link href={`blogs/${blog.slug}`} title="View Blog Details">
          <h2 className="font-bold text-neutral-900 md:text-xl dark:text-neutral-200 hover:underline">{blog.title}</h2>
        </Link>

        {blog.overview && (
          <p className="mt-3 text-sm sm:text-xs md:text-sm  text-gray-600 dark:text-[#b5b7ba] line-clamp-3 sm:line-clamp-2 md:line-clamp-4 mb-2">
            {blog.overview}
          </p>
        )}

        {blog.category && (
          <div className="flex">
            <div className="px-2 py-1 text-xs font-bold rounded bg-sky-800 text-gray-50 mb-2 italic">
              {blog.category.name}
            </div>
          </div>
        )}

        {blog.tags && (
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {blog.tags.split(',').map((tag, index) => {
              return (
                <span key={`${tag}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                  {tag.toLowerCase()}
                </span>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="z-10 flex items-center gap-3 font-barlow">
            <div className="flex flex-col">
              <Link href="/about" className="text-sm font-bold hover:underline">
                {blog.author}
              </Link>
              <span className="text-xs">{getFormattedDate(new Date(blog.created_at))}</span>
            </div>
          </div>
          <p className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-dark-3 md:text-sm">
            <span className='px-2 py-1 text-xs rounded bg-gray-700 text-gray-50'>{readingTime.text}</span>
          </p>
        </div>
      </div>
    </motion.article>
  )
}
