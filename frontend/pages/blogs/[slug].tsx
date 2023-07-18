import BlogLayout from "@layout/BlogLayout"
import PageNotFound from "pages/404"
import { ProfileType, BlogType } from "@lib/types"
import { getBlogDetails, getProfileInfo } from "@lib/backendAPI"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'


export default function Post({
  error,
}: {
  error: boolean;
}) {
  if (error) return <PageNotFound />

  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { slug } = router.query // Retrieve the slug parameter from the URL

  const [blog, setBlog] = useState<BlogType>()

  const [profileInfo, setProfileInfo] = useState<ProfileType>()

  const fetchProfileInfo = async () => {
    const profileData: ProfileType = await getProfileInfo()
    setProfileInfo(profileData)
  }

  const fetchBlogDetail = async (slug: any) => {
    try {
      const blogData: BlogType = await getBlogDetails(slug)
      setBlog(blogData)
    } catch (error) {
      // Handle error case
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProfileInfo(),
        fetchBlogDetail(slug)
      ]);
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  // ******* Loader Starts *******
  if (isLoading === true) {
    return (
      <Loader />
    )
  }
  // ******* Loader Ends *******

  // ******* No Data Check *******
  if (!blog) {
    return (
      <NoData topic="Blog" />
    )
  }
  // ******* No Data Check *******

  return (
    <>
      <Metadata
        title={blog.title}
        description={blog.overview || pageMeta.projects.description}
        previewImage={blog.image || pageMeta.projects.image}
        keywords={blog.tags || pageMeta.projects.keywords}
      />

      {blog && profileInfo ? (
        <BlogLayout blog={blog} profileInfo={profileInfo}></BlogLayout>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
