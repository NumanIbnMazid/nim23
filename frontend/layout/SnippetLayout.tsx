import { opacityVariant } from "@content/FramerMotionVariants"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import { CodeSnippetType } from "@lib/types"
import Image from "next/image"
import cn from 'classnames'
import { useEffect } from 'react'

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
          <h1 className="m-0 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
            {code_snippet.title}
          </h1>

          <div className="relative flex items-center justify-center w-12 h-12 p-1 overflow-hidden">
            <Image
              className="m-0"
              src={code_snippet.image}
              alt={code_snippet.title}
              width={62}
              height={62}
            ></Image>
          </div>
        </div>

        <p>{code_snippet.short_description}</p>

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
