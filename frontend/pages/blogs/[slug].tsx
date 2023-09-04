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

  const blogOverview = blog?.overview ? stripHtml(blog.overview) : undefined

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

  // ******* Loader *******
  if (isLoading === true) {
    return <Loader />
  }
  // ******* Loader *******

  // ******* No Data *******
  if (!blog) {
    return <NoData allowSpacing={true} />
  }
  // ******* No Data *******

  return (
    <>
      <MetaData
        title={blog.title}
        description={blogOverview || pageMeta.blogs.description}
        previewImage={pageMeta.blogs.image}
        keywords={blog.tags || pageMeta.blogs.keywords}
      />

      {blog && profileInfo ? <BlogLayout blog={blog} profileInfo={profileInfo}></BlogLayout> : null}
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
