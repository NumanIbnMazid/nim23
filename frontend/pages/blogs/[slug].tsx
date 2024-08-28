import { ProfileType, BlogType } from '@lib/types'
import { getProfileInfo } from '@lib/backendAPI'
import { useEffect, useState } from 'react'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import MetaData from '@components/MetaData'
import pageMeta from '@content/meta'
import dynamic from 'next/dynamic'
import { useClientID } from '@context/clientIdContext'
import { getOrSetClientID } from '@lib/clientIDManager'

const BlogLayout = dynamic(() => import('@layout/BlogLayout'), {
  loading: () => <Loader />,
})

export default function BlogDetails({ slug }: { slug: string }) {

  const [isLoading, setIsLoading] = useState(true)
  const { clientID } = useClientID()
  const [blog, setBlog] = useState<BlogType>()
  const [profileInfo, setProfileInfo] = useState<ProfileType>()

  function stripHtml(html: string) {
    const strippedText = html.replace(/<[^>]*>/g, '') // Removes all HTML tags
    return strippedText
  }

  const fetchProfileInfo = async () => {
    const profileData: ProfileType = await getProfileInfo()
    setProfileInfo(profileData)
  }

  const fetchBlogDetail = async (slug: string, clientIDParam: string) => {
    try {
      // Fetch the blog details from the API with slug and clientID as query parameters
      const response = await fetch(`/api/blog/details?slug=${encodeURIComponent(slug)}&clientID=${encodeURIComponent(clientIDParam)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const data = await response.json()
      setBlog(data)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  const blogOverview = blog?.overview ? stripHtml(blog.overview) : undefined

  useEffect(() => {
    const fetchData = async () => {
      const clientIDParam = clientID || getOrSetClientID()
      await Promise.all([fetchProfileInfo(), fetchBlogDetail(slug, clientIDParam)])
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  return (
    <>
      <MetaData
        title={blog?.title || pageMeta.blogs.title}
        description={blogOverview || pageMeta.blogs.description}
        previewImage={blog?.image || pageMeta.blogs.image}
        keywords={blog?.tags || pageMeta.blogs.keywords}
      />

      {isLoading ? (
        <Loader />
      ) : blog && profileInfo ? (
        <BlogLayout blog={blog} profileInfo={profileInfo}></BlogLayout>
      ) : (
        <NoData allowSpacing={true} />
      )}
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { slug } = context.params
  return {
    props: {
      slug
    }
  }
}
