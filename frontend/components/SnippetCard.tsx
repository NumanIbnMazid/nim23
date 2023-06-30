import { CodeSnippetType } from "@lib/types"
import Image from "next/image"
import Link from "next/link"

export default function SnippetCard({ snippet }: { snippet: CodeSnippetType }) {
  return (
    <Link
      href={`code-snippets/${snippet.slug}`}
      title="View Code Snippet Details"
      className="w-full p-4 ring-1 ring-gray-300 hover:ring-gray-400 dark:ring-[#444] bg-white dark:bg-transparent dark:hover:bg-darkSecondary dark:hover:ring-[#555] flex flex-col gap-2 rounded"
    >
      <div className="p-1 overflow-hidden w-fit">
        <Image
          src={snippet.image}
          alt={snippet.title}
          width={40}
          height={40}
        ></Image>
      </div>
      <h2 className="text-lg font-bold text-black dark:text-white">
        {snippet.title}
      </h2>
      <p className="-mt-1 text-base text-neutral-500">
        {snippet.short_description}
      </p>
      {/* <div className="-mt-1" dangerouslySetInnerHTML={{ __html: snippet.content }} /> */}
    </Link>
  )
}
