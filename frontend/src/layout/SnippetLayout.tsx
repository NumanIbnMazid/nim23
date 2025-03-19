import ShareOnSocialMedia from '../components/ShareOnSocialMedia'
import { FiPrinter } from 'react-icons/fi'
import useWindowLocation from '@/hooks/useWindowLocation'
import { CodeSnippetType } from '@/lib/types'
import Image from 'next/image'
import { highlightCode, addCopyListeners } from '@/utils/functions'
import { useEffect, useState } from 'react'
import { getFormattedDate } from '@/utils/date'
import CommentSection from '@/components/SnippetComment/CommentSection'
import CommentList from '@/components/SnippetComment/CommentList'
import { AiFillEye, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useClientID } from '@/context/clientIdContext'
import { getOrSetClientID } from '@/lib/clientIDManager'
import { PUBLIC_SITE_URL } from '@/lib/constants'
import { SNIPPET_INTERACTION_API_ROUTE } from '@/lib/apiRouteMaps'

export default function SnippetLayout({ code_snippet }: { code_snippet: CodeSnippetType }) {
  const [processedContent, setProcessedContent] = useState<string>(code_snippet.content)
  const { currentURL } = useWindowLocation()
  const [filteredClientID, setFilteredClientID] = useState('1')
  const [totalViews, setTotalViews] = useState<number>(code_snippet.total_views)
  const [totalLikes, setTotalLikes] = useState<number>(code_snippet.total_likes)
  const [userLiked, setUserLiked] = useState<boolean>(code_snippet.user_liked)
  const SNIPPET_ENDPOINT = PUBLIC_SITE_URL + '/snippets/' + code_snippet.slug

  const { clientID } = useClientID()

  const [isLiking, setIsLiking] = useState(false) // ✅ Prevent multiple like requests
  const [lastFetchedSlug, setLastFetchedSlug] = useState<string | null>(null) // ✅ Prevent duplicate fetches

  const fetchSnippetInteractions = async (slug: string, userClientID: string) => {
    if (isLiking || lastFetchedSlug === slug) return // ✅ Prevent fetching during like action
    setLastFetchedSlug(slug) // ✅ Track last fetched slug

    try {
      const response = await fetch(
        `${SNIPPET_INTERACTION_API_ROUTE}?slug=${encodeURIComponent(slug)}&clientID=${encodeURIComponent(
          userClientID
        )}`
      )
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const interactionData = await response.json()
      setTotalViews(interactionData.total_views)
      setTotalLikes(interactionData.total_likes)
      setUserLiked(interactionData.user_liked)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const toggleLike = async () => {
    if (!code_snippet.slug || !filteredClientID || isLiking) return // ✅ Prevent double click

    setIsLiking(true) // ✅ Lock button to prevent multiple clicks
    setUserLiked((prev) => !prev)
    setTotalLikes((prev) => (userLiked ? prev - 1 : prev + 1)) // ✅ Instant UI feedback

    try {
      await fetch(
        `${SNIPPET_INTERACTION_API_ROUTE}?slug=${encodeURIComponent(code_snippet.slug)}&clientID=${encodeURIComponent(
          filteredClientID
        )}&action=like`
      )
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setTimeout(() => {
        fetchSnippetInteractions(code_snippet.slug, filteredClientID) // ✅ Fetch updated data only after like
        setIsLiking(false) // ✅ Unlock button
      }, 300) // ✅ Delay ensures API is not triggered twice
    }
  }

  useEffect(() => {
    const clientIDParam = clientID || getOrSetClientID()
    setFilteredClientID(clientIDParam)

    if (code_snippet.slug && clientIDParam && !isLiking) {
      // ✅ Prevents fetching while liking
      const timer = setTimeout(() => {
        fetchSnippetInteractions(code_snippet.slug, clientIDParam)
      }, 50) // ✅ Debounce API call

      return () => clearTimeout(timer)
    }
  }, [code_snippet.slug, clientID]) // ✅ `isLiking` removed to prevent unnecessary re-fetching

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
    async function processCode() {
      const highlighted = await highlightCode(code_snippet.content)
      setProcessedContent(highlighted)
    }

    processCode()
  }, [code_snippet.content])

  // ✅ Add event listeners for copy buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      addCopyListeners()
    }
  }, [processedContent, totalLikes, userLiked, totalViews, isLiking])

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
            <span className="text-base text-gray-500">{totalLikes}</span>
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
          <div className="mb-2 mt-2">
            <div className="grid grid-cols-[auto_1fr] items-start">
              <span className="text-base text-gray-500 whitespace-nowrap">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {code_snippet.tags.split(',').map((tag, index) => (
                  <span key={`${tag}-${index}`} className="px-2 py-1 text-xs rounded bg-teal-800 text-gray-50">
                    {tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
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
        <div className="text-slate-700 max-w-full prose-sm blog-container sm:prose-base prose-pre:bg-white prose-pre:shadow dark:prose-pre:shadow-black/80 dark:prose-pre:bg-darkSecondary prose-pre:saturate-150 dark:prose-pre:saturate-100 marker:text-black dark:marker:text-white">
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        {/* Like Button */}
        <div className="print:hidden">
          <div className="flex items-center w-full mt-10 mb-5">
            <div className="cursor-pointer">
              <div className="cursor-pointer" onClick={toggleLike}>
                {userLiked ? <AiFillLike className="w-10 h-10" /> : <AiOutlineLike className="w-10 h-10" />}
              </div>
            </div>
            <div className="mx-2 font-bold">{totalLikes}</div>
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
          <CommentList snippet_comments={code_snippet.code_snippet_comments || []} /> {/* ✅ Pass comments */}
        </div>
      </section>
    </section>
  )
}
