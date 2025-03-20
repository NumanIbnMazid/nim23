import { CodeSnippetType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillEye, AiFillLike } from 'react-icons/ai'

export default function SnippetCard({ code_snippet }: { code_snippet: CodeSnippetType }) {
  return (
    <Link
      href={`snippets/${code_snippet.slug}`}
      prefetch={true}
      title="View Code Snippet Details"
      className="w-full p-4 bg-white dark:bg-darkSecondary ring-1 hover:bg-darkWhite dark:hover:bg-darkFourth dark:hover:ring-[#555] ring-gray-300 hover:ring-gray-400 dark:ring-[#444] flex flex-col gap-2 rounded"
    >
      <div className="p-1 overflow-hidden w-fit">
        <Image src={code_snippet.image} alt={code_snippet.title} width={40} height={40}></Image>
      </div>
      <h2 className="text-lg font-bold text-black dark:text-white">{code_snippet.title}</h2>
      {code_snippet.overview && (
        <div
          className="-mt-1 text-sm sm:text-xs md:text-sm text-neutral-500 line-clamp-3 sm:line-clamp-2 md:line-clamp-4"
          dangerouslySetInnerHTML={{ __html: code_snippet.overview || '' }}
        ></div>
      )}
      {code_snippet.language && (
        <div className="flex flex-wrap items-center gap-1">
          {code_snippet.language.split(',').map((code_snippet, index) => {
            return (
              <span key={`${code_snippet}-${index}`} className="px-2 py-1 text-xs rounded bg-sky-800 text-gray-50">
                {code_snippet.toLowerCase()}
              </span>
            )
          })}
        </div>
      )}
      {code_snippet.tags && (
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {code_snippet.tags.split(',').map((tag, index) => {
            return (
              <span key={`${tag}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                {tag.toLowerCase()}
              </span>
            )
          })}
        </div>
      )}

      {/* Total Views and Likes */}
      <div className="flex flex-wrap items-center gap-4 w-fit pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <AiFillEye className="w-4 h-4" />
          <span className="text-sm text-gray-500">{code_snippet.total_views}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AiFillLike className="w-4 h-4" />
          <span className="text-sm text-gray-500">{code_snippet.total_likes}</span>
        </div>
      </div>
    </Link>
  )
}
