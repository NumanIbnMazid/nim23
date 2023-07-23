import { CodeSnippetType } from '@lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function SnippetCard({ code_snippet }: { code_snippet: CodeSnippetType }) {
  return (
    <Link
      href={`code-snippets/${code_snippet.slug}`}
      title="View Code Snippet Details"
      className="w-full p-4 bg-white dark:bg-darkSecondary ring-1 hover:bg-darkWhite dark:hover:bg-darkFourth dark:hover:ring-[#555] ring-gray-300 hover:ring-gray-400 dark:ring-[#444] flex flex-col gap-2 rounded"
    >
      <div className="p-1 overflow-hidden w-fit">
        <Image src={code_snippet.image} alt={code_snippet.title} width={40} height={40}></Image>
      </div>
      <h2 className="text-lg font-bold text-black dark:text-white">{code_snippet.title}</h2>
      {code_snippet.overview && <p className="-mt-1 text-base text-neutral-500">{code_snippet.overview}</p>}
      {code_snippet.language && (
        <div className="flex flex-wrap items-center gap-1">
          {code_snippet.language.split(',').map((code_snippet, index) => {
            return (
              <span key={`${code_snippet}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                {code_snippet.toLowerCase()}
              </span>
            )
          })}
        </div>
      )}
    </Link>
  )
}
