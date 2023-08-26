import { opacityVariant } from "@content/FramerMotionVariants"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import ShareOnSocialMedia from '../components/ShareOnSocialMedia'
import { FiPrinter } from 'react-icons/fi'
import useWindowLocation from '@hooks/useWindowLocation'
import { CodeSnippetType, LikeStatusType, ViewsType } from '@lib/types'
import Image from "next/image"
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { getFormattedDate } from "@utils/date"
import Prism from '../prismSetup'
import CommentSection from '@components/SnippetComment/CommentSection'
import CommentList from '@components/SnippetComment/CommentList'
import { AiFillEye, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { addSnippetLike, addSnippetViews } from '@lib/backendAPI'



export default function SnippetLayout({
  code_snippet,
}: {
  code_snippet: CodeSnippetType,
  children: React.ReactNode
}) {

  const { currentURL } = useWindowLocation()
  const hasCode = code_snippet && code_snippet.content.includes('<code>')
  const [_likeStatus, setLikeStatus] = useState<LikeStatusType>()
  const [fakeTotalLikes, setFakeTotalLikes] = useState<number>(code_snippet.total_likes)
  const [fakeLikeStatus, setFakeLikeStatus] = useState<boolean>(code_snippet.user_liked)
  const [totalViews, setTotalViews] = useState<number>(code_snippet.total_views)
  const SNIPPET_ENDPOINT = 'https://nim23.com' + '/snippets/' + code_snippet.slug

  const addLike = async (slug: string) => {
    const likeStatusData: LikeStatusType = await addSnippetLike(slug)
    setLikeStatus(likeStatusData)
  }

  const fetchTotalViews = async (slug: string) => {
    const clientID = localStorage.getItem('clientID') || ''
    const totalViewsData: ViewsType = await addSnippetViews(clientID, slug)
    setTotalViews(totalViewsData.total_views)
  }

  const injectStyle = () => {
    if (hasCode) {
      const style = document.createElement('style');
      style.innerHTML = `
        .text-code code {
          color: #78a5b3
        }
      `
      document.head.appendChild(style)
    }
  }

  function adjustContentForPrint() {
    // Table of Contents
    const tocComponent = document.querySelector('.hide-on-print')
    // Hide the TOC
    tocComponent!.classList.add('hide-on-print')

    const style = document.createElement('style')
    style.textContent = `
    @media print {
      code[class*="language-"],
      pre[class*="language-"] {
        overflow: visible !important;
        white-space: pre-wrap;
      }
    }
  `
    document.head.appendChild(style)

    // Find all code and pre elements that need adjustments
    const codeElements = document.querySelectorAll('code[class*="language-"]')
    const preElements = document.querySelectorAll('pre[class*="language-"]')

    // Apply the CSS class for printing adjustments
    codeElements.forEach((codeElement) => {
      codeElement.classList.add('print-adjusted')
    })

    preElements.forEach((preElement) => {
      preElement.classList.add('print-adjusted')
    })

    // Call the print function
    window.print()

    // Show the TOC
    tocComponent!.classList.remove('hide-on-print')

    // Remove the CSS class and clean up the added style tag
    codeElements.forEach((codeElement) => {
      codeElement.classList.remove('print-adjusted')
    })

    preElements.forEach((preElement) => {
      preElement.classList.remove('print-adjusted')
    })

    document.head.removeChild(style)
  }

  useEffect(() => {
    injectStyle()

    // Prism JS
    if (typeof window !== 'undefined') {
      Prism.highlightAll()
      // Prism.plugins.lineNumbers = true
    }
  }, [hasCode])

  useEffect(() => {
    if (code_snippet.slug) {
      fetchTotalViews(code_snippet.slug)
    }
  }, [])

  return (
    <section className="mt-[44px] md:mt-[60px] relative !overflow-hidden">
      <section className="relative max-w-4xl p-5 mx-auto prose sm:pt-10 font-barlow dark:prose-invert bg-darkWhitePrimary dark:bg-darkPrimary">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            {code_snippet.title}
          </h1>
          <div className="relative flex items-center justify-center w-20 h-12 p-1 overflow-hidden">
            <Image className="m-0" src={code_snippet.image} alt={code_snippet.title} width={100} height={100}></Image>
          </div>
        </div>

        {/* Total Views and Likes */}
        <div className="flex flex-wrap items-center gap-4 w-fit my-5">
          <div className="flex flex-wrap items-center gap-2">
            <AiFillEye className="w-4 h-4" />
            <span className="text-base text-gray-500">{totalViews}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AiFillLike className="w-4 h-4" />
            <span className="text-base text-gray-500">{fakeTotalLikes}</span>
          </div>
        </div>

        {code_snippet.overview && (
          <div className="text-lg" dangerouslySetInnerHTML={{ __html: code_snippet.overview || '' }}></div>
        )}

        {code_snippet.language && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-base text-gray-500">Language: </span>
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
          <div className="flex flex-wrap items-center gap-1 mb-2 mt-2">
            <span className="text-base text-gray-500">Tags: </span>
            {code_snippet.tags.split(',').map((tag, index) => {
              return (
                <span key={`${tag}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                  {tag.toLowerCase()}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-4 text-base text-gray-500">
          <span>Created at: </span>
          {getFormattedDate(new Date(code_snippet.created_at))}
        </div>

        {getFormattedDate(new Date(code_snippet.created_at)) !==
          getFormattedDate(new Date(code_snippet.updated_at)) && (
          <div className="text-base text-gray-500">
            <span>Last Update: </span>
            {getFormattedDate(new Date(code_snippet.updated_at))}
          </div>
        )}

        {/* Content */}
        <AnimatedDiv
          variants={opacityVariant}
          className="text-slate-700 max-w-full prose-sm blog-container sm:prose-base prose-pre:bg-white prose-pre:shadow dark:prose-pre:shadow-black/80 dark:prose-pre:bg-darkSecondary prose-pre:saturate-150 dark:prose-pre:saturate-100 marker:text-black dark:marker:text-white"
        >
          <div
            dangerouslySetInnerHTML={{ __html: code_snippet.content }}
            className={cn('my-4', { 'text-code': hasCode, 'line-numbers': hasCode })}
          />
        </AnimatedDiv>

        {/* Like Button */}
        <div>
          <div className="flex items-center w-full mt-10 mb-5">
            <div className="cursor-pointer">
              {fakeLikeStatus === true ? (
                <AiFillLike
                  className="w-10 h-10"
                  onClick={() => {
                    addLike(code_snippet.slug)
                    setFakeTotalLikes(fakeTotalLikes - 1)
                    setFakeLikeStatus(false)
                  }}
                />
              ) : fakeLikeStatus === false ? (
                <AiOutlineLike
                  className="w-10 h-10"
                  onClick={() => {
                    addLike(code_snippet.slug)
                    setFakeTotalLikes(fakeTotalLikes + 1)
                    setFakeLikeStatus(true)
                  }}
                />
              ) : null}
            </div>
            <div className="mx-2 font-bold">{fakeTotalLikes}</div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center w-full gap-4 my-10 print:hidden">
          <h3 style={{ margin: '0' }} className="text-xl font-semibold dark:text-white">
            Share
          </h3>
          <ShareOnSocialMedia
            className="flex flex-wrap items-center gap-2 w-fit"
            title={code_snippet.title}
            url={currentURL}
            summary={code_snippet.overview || code_snippet.title}
            cover_image={code_snippet.image}
          >
            <div className="p-2 text-white bg-gray-700 rounded-full cursor-pointer hover:bg-cyan-700">
              <FiPrinter className="w-4 h-4" onClick={() => adjustContentForPrint()} />
            </div>
          </ShareOnSocialMedia>
        </div>

        <div className="hide-on-print">
          <CommentSection slug={code_snippet.slug} contentURL={SNIPPET_ENDPOINT} />
          <CommentList slug={code_snippet.slug} />
        </div>
      </section>
    </section>
  )
}
