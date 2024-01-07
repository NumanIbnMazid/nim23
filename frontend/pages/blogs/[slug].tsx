import { ProfileType, BlogType } from '@lib/types'
import { getBlogDetails, getProfileInfo } from '@lib/backendAPI'
import { useEffect, useState } from 'react'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import MetaData from '@components/MetaData'
import pageMeta from '@content/meta'
import dynamic from 'next/dynamic'
import { useClientID } from '@context/clientIdContext'

const BlogLayout = dynamic(() => import('@layout/BlogLayout'), {
  loading: () => <Loader />,
})

export default function BlogDetails({ slug, blogData }: { slug: string, blogData: BlogType }) {

  const [isLoading, setIsLoading] = useState(true)
  const { clientID } = useClientID()

  const [blog, setBlog] = useState<BlogType>()

  const [profileInfo, setProfileInfo] = useState<ProfileType>()

  function stripHtml(html: string) {
    const strippedText = html.replace(/<[^>]*>/g, '') // Removes all HTML tags
    return strippedText
  }

  const blogOverview = blogData?.overview ? stripHtml(blogData.overview) : undefined

  const fetchProfileInfo = async () => {
    const profileData: ProfileType = await getProfileInfo()
    setProfileInfo(profileData)
  }

  const fetchBlogDetail = async (slug: any) => {
    try {
      if (!clientID) return
      const blogData: BlogType = await getBlogDetails(clientID, slug)
      setBlog(blogData)
    } catch (error) {
      // Handle error case
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProfileInfo(), fetchBlogDetail(slug)])
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  return (
    <>
      <MetaData
        title={blogData.title || pageMeta.blogs.title}
        description={blogOverview || pageMeta.blogs.description}
        previewImage={blogData.image || pageMeta.blogs.image}
        keywords={blogData.tags || pageMeta.blogs.keywords}
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
  const blogData: BlogType = await getBlogDetails('1', slug)
  return {
    props: {
      slug,
      blogData
    }
  }
}
