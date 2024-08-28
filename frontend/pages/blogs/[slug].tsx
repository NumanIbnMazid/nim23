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

  const fetchBlogDetail = async (slug: any) => {
    try {
      if (!clientID) return
      const blogData: BlogType = await getBlogDetails(clientID, slug)
      setBlog(blogData)
    } catch (error) {
      console.log(error)
    }
  }

  const blogOverview = blog?.overview ? stripHtml(blog.overview) : undefined

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
