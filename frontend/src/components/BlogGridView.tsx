import Link from 'next/link'
import { getFormattedDate } from '@/utils/date'
import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BlogCardAnimation } from '@/content/FramerMotionVariants'
import readTime from 'reading-time'
import { AiFillEye, AiFillLike } from 'react-icons/ai'
import { BlogType } from '@/lib/types'

export default function BlogGridView({ blog, animate = false }: { blog: BlogType; animate?: boolean }) {
  const blogRef = useRef(null)
  const hasCode = blog.content.includes('<code>') // ✅ Ensure `hasCode` is used
  const readingTime = readTime(blog.content) // ✅ Ensure `readingTime` is used

  return (
    <div>
      <Link href={`/blogs/${blog.slug}`} title="View Blog Details" prefetch={true}>
        <motion.article
          ref={blogRef}
          variants={BlogCardAnimation}
          initial={animate && 'hidden'}
          whileInView={animate ? 'visible' : ''}
          viewport={{ once: true }}
          className="bg-white dark:bg-darkSecondary hover:bg-darkWhite dark:hover:bg-darkFourth ring-1 dark:hover:ring-[#555] ring-gray-300 hover:ring-gray-400 dark:ring-[#444] rounded-2xl p-4 flex flex-col shadow-md md:shadow-lg"
        >
          {/* Image */}
          <div className="mb-4">
            <Image
              title={blog.title}
              alt={blog.title}
              src={blog.image}
              width={1200}
              height={600}
              blurDataURL={blog.image}
              quality={50}
              className="my-auto transition-all duration-300 backdrop-blur-xl rounded-xl w-full h-auto object-cover"
            />
          </div>

          {/* Blog Title */}
          <h2 className="font-bold text-neutral-900 text-xl dark:text-neutral-200 mb-2">{blog.title}</h2>

          {/* Category and Subcategory */}
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {blog.category && (
              <div className="px-2 py-1 text-xs font-bold rounded bg-sky-800 text-gray-50 italic">
                {blog.category.name}
              </div>
            )}
            {blog.sub_category && (
              <div className="px-2 py-1 text-xs font-bold rounded bg-sky-800 text-gray-50 italic">
                {blog.sub_category.name}
              </div>
            )}
          </div>

          {/* Author and Created At */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="text-sm font-bold">{blog.author}</div>
              <span className="text-xs">{getFormattedDate(new Date(blog.created_at))}</span>
            </div>

            {/* Reading Time */}
            {readingTime && !hasCode && (
              <p className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-dark-3 md:text-sm">
                <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-50">{readingTime.text}</span>
              </p>
            )}
          </div>

          {/* Views and Likes */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <AiFillEye className="w-4 h-4" />
              <span className="text-sm text-gray-500">{blog.total_views}</span>
            </div>
            <div className="flex items-center gap-2">
              <AiFillLike className="w-4 h-4" />
              <span className="text-sm text-gray-500">{blog.total_likes}</span>
            </div>
          </div>
        </motion.article>
      </Link>
    </div>
  )
}
