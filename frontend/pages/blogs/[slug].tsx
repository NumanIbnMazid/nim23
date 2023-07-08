import BlogLayout from "@layout/BlogLayout"
import Metadata from "@components/MetaData"
import MDXComponents from "@components/MDXComponents"
import PageNotFound from "pages/404"
import { MDXRemote } from "next-mdx-remote"
import { PostType, BlogType } from "@lib/types"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function Post({
  post,
  error,
}: {
  post: PostType;
  error: boolean;
}) {
  if (error) return <PageNotFound />

  const router = useRouter()
  const { slug } = router.query // Retrieve the slug parameter from the URL

  const [code_snippet, setCodeSnippet] = useState<BlogType>()

  const fetchCodeSnippetDetail = async (slug: string) => {
    try {
      const codeSnippetData: BlogType = await getCodeSnippetDetails(slug)
      setCodeSnippet(codeSnippetData)
    } catch (error) {
      // Handle error case
      console.error(error)
    }
  }

  // Add this useEffect to trigger the API request when slug is available
  useEffect(() => {
    if (typeof slug === 'string') {
      fetchCodeSnippetDetail(slug)
    }
  }, [slug])

  return (
    <>
      <Metadata
        title={post.meta.title}
        suffix="Numan Ibn Mazid"
        description={post.meta.excerpt}
        previewImage={post.meta.image}
        keywords={post.meta.keywords}
      />

      <BlogLayout post={post}>
        <MDXRemote
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
        />
      </BlogLayout>
    </>
  )
}
