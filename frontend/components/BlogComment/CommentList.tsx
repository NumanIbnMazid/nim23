import React from 'react'
import { CommentType } from '@lib/types'
import { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import NoData from '@components/NoData'

const CommentList = ({ slug }: { slug: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<CommentType[]>([])

  const fetchBlogCommentList = async (slug: any) => {
    try {
      const response = await fetch(`/api/blogs/comments?name=${encodeURIComponent("")}&email=${encodeURIComponent("")}&comment=${encodeURIComponent("")}&slug=${encodeURIComponent(slug)}&method=${encodeURIComponent("GET")}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const blogCommentData: CommentType[] = await response.json()
      setComments(blogCommentData)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchBlogCommentList(slug)])
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  // ******* Loader *******
  if (isLoading === true) {
    return <Loader />
  }
  // ******* Loader *******

  // ******* No Data *******
  if (comments.length < 1) {
    return <NoData allowSpacing={false} message='No comments available!' />
  }
  // ******* No Data *******

  return (
    <div className="space-y-4 py-10 px-5">
      {comments.map((comment: CommentType, index: number) => (
        <div key={index} className="flex space-x-4">
          <div className="w-10 h-10">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="text-current"
            >
              <path
                className="fill-current"
                d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm8.127 19.41c-.282-.401-.772-.654-1.624-.85-3.848-.906-4.097-1.501-4.352-2.059-.259-.565-.19-1.23.205-1.977 1.726-3.257 2.09-6.024 1.027-7.79-.674-1.119-1.875-1.734-3.383-1.734-1.521 0-2.732.626-3.409 1.763-1.066 1.789-.693 4.544 1.049 7.757.402.742.476 1.406.22 1.974-.265.586-.611 1.19-4.365 2.066-.852.196-1.342.449-1.623.848 2.012 2.207 4.91 3.592 8.128 3.592s6.115-1.385 8.127-3.59zm.65-.782c1.395-1.844 2.223-4.14 2.223-6.628 0-6.071-4.929-11-11-11s-11 4.929-11 11c0 2.487.827 4.783 2.222 6.626.409-.452 1.049-.81 2.049-1.041 2.025-.462 3.376-.836 3.678-1.502.122-.272.061-.628-.188-1.087-1.917-3.535-2.282-6.641-1.03-8.745.853-1.431 2.408-2.251 4.269-2.251 1.845 0 3.391.808 4.24 2.218 1.251 2.079.896 5.195-1 8.774-.245.463-.304.821-.179 1.094.305.668 1.644 1.038 3.667 1.499 1 .23 1.64.59 2.049 1.043"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{comment.name}</span>
            <p className="text-base font-normal text-gray-800 dark:text-gray-400">{comment.comment}</p>
            <span className="text-sm text-gray-500">{comment.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList
