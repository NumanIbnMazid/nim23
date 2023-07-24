import BlogLayout from "@layout/BlogLayout"
import PageNotFound from "pages/404"
import { ProfileType, BlogType } from "@lib/types"
import { getBlogDetails, getProfileInfo } from "@lib/backendAPI"
import { useEffect, useState } from 'react'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'


export default function BlogDetails({ error, slug }: { error: boolean, slug: string }) {
  if (error) return <PageNotFound />

  const [isLoading, setIsLoading] = useState(true)

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
      <Metadata
        title={blog.title}
        description={blog.overview || pageMeta.projects.description}
        previewImage={blog.image || pageMeta.projects.image}
        keywords={blog.tags || pageMeta.projects.keywords}
      />

      {blog && profileInfo ? <BlogLayout blog={blog} profileInfo={profileInfo}></BlogLayout> : null}
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { slug } = context.params
  return {
    props: {
      slug,
    },
  }
}
