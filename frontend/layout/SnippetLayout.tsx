import { opacityVariant } from "@content/FramerMotionVariants"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import { CodeSnippetType } from "@lib/types"
import Image from "next/image"
import cn from 'classnames'
import { useEffect } from 'react'
import { getFormattedDate } from "@utils/date"


export default function SnippetLayout({
  code_snippet,
}: {
  code_snippet: CodeSnippetType,
  children: React.ReactNode;
}) {

  const hasCode = code_snippet && code_snippet.content.includes('<code>')

  const injectStyle = () => {
    if (hasCode) {
      const style = document.createElement('style');
      style.innerHTML = `
        .text-code code {
          color: #9c885a; // Set the desired dark text color
        }
      `;
      document.head.appendChild(style);
    }
  };

  useEffect(() => {
    injectStyle();
  }, [hasCode]);

  return (
    <section className="mt-[44px] md:mt-[60px]  relative !overflow-hidden">
      <section className="relative max-w-3xl p-5 mx-auto prose sm:pt-10 font-barlow dark:prose-invert">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            {code_snippet.title}
          </h1>
          <div className="relative flex items-center justify-center w-20 h-12 p-1 overflow-hidden">
            <Image
              className="m-0"
              src={code_snippet.image}
              alt={code_snippet.title}
              width={100}
              height={100}
            ></Image>
          </div>
        </div>

        <p className="text-xl">{code_snippet.short_description}</p>

        {code_snippet.language && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="px-2 py-1 text-base text-gray-500 bg-gray-200 rounded dark:bg-slate-800 italic">
              {code_snippet.language}
            </span>
          </div>
        )}

        <div className="mt-4 text-base text-gray-500">
          <span>Created at: </span>
          {getFormattedDate(new Date(code_snippet.created_at))}
        </div>

        {getFormattedDate(new Date(code_snippet.created_at)) !== getFormattedDate(new Date(code_snippet.updated_at)) && (
        <div className="text-base text-gray-500">
          <span>Last Update: </span>
          {getFormattedDate(new Date(code_snippet.updated_at))}
        </div>
        )}

        <AnimatedDiv
          variants={opacityVariant}
          className="text-orange-700 max-w-full prose-sm blog-container sm:prose-base prose-pre:bg-white prose-pre:shadow dark:prose-pre:shadow-black/80 dark:prose-pre:bg-darkSecondary prose-pre:saturate-150 dark:prose-pre:saturate-100 marker:text-black dark:marker:text-white"
        >
          <div dangerouslySetInnerHTML={{ __html: code_snippet.content }}
          className={cn('my-4', { 'text-code': hasCode })} />
        </AnimatedDiv>
      </section>
    </section>
  )
}
