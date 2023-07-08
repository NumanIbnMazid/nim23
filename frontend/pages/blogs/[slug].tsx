import BlogLayout from "@layout/BlogLayout"
import PageNotFound from "pages/404"
import { ProfileType, BlogType } from "@lib/types"
import { getBlogDetails, getProfileInfo } from "@lib/backendAPI"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function Post({
  error,
}: {
  error: boolean;
}) {
  if (error) return <PageNotFound />

  const router = useRouter()
  const { slug } = router.query // Retrieve the slug parameter from the URL

  const [blog, setBlog] = useState<BlogType>()

  const [profileInfo, setProfileInfo] = useState<ProfileType>()

  const fetchProfileInfo = async () => {
    const profileData: ProfileType = await getProfileInfo()
    setProfileInfo(profileData)
  }

  const fetchBlogDetail = async (slug: string) => {
    try {
      const blogData: BlogType = await getBlogDetails(slug)
      setBlog(blogData)
    } catch (error) {
      // Handle error case
      console.error(error)
    }
  }

  // Add this useEffect to trigger the API request when slug is available
  useEffect(() => {
    if (typeof slug === 'string') {
      fetchProfileInfo()
      fetchBlogDetail(slug)
    }
  }, [slug])

  return (
    <>
      {/* <Metadata
        title={post.meta.title}
        suffix="Numan Ibn Mazid"
        description={post.meta.excerpt}
        previewImage={post.meta.image}
        keywords={post.meta.keywords}
      /> */}

      {blog && profileInfo ? (
        <BlogLayout blog={blog} profileInfo={profileInfo}></BlogLayout>
      ) : (
        <p>Loading...</p>
      )}


        {/* <MDXRemote
          {...post.source}
          frontmatter={{
            slug: post.meta.slug,
            excerpt: post.meta.excerpt,
            title: post.meta.title,
            date: post.meta.date,
            keywords: post.meta.keywords,
            image: post.meta.image,
          }}
          components={MDXComponents}
        /> */}

    </>
  )
}
