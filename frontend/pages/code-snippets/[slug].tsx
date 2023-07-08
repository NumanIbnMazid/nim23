import PageNotFound from "pages/404"
import { CodeSnippetType } from "@lib/types"
import SnippetLayout from "@layout/SnippetLayout"
// import pageMeta from "@content/meta"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCodeSnippetDetails } from '@lib/backendAPI'

export default function SnippetPage({
  error,
}: {
  error: boolean;
}) {
  if (error) return <PageNotFound />

  const router = useRouter()
  const { slug } = router.query // Retrieve the slug parameter from the URL

  const [code_snippet, setCodeSnippet] = useState<CodeSnippetType>()

  const fetchCodeSnippetDetail = async (slug: string) => {
    try {
      const codeSnippetData: CodeSnippetType = await getCodeSnippetDetails(slug)
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
      {/* <Metadata
        title={snippet.meta.title}
        suffix="Numan Ibn Mazid"
        description={snippet.meta.excerpt}
        previewImage={pageMeta.snippets.image}
        keywords={pageMeta.snippets.keywords}
      /> */}

      {code_snippet ? (

        <SnippetLayout code_snippet={code_snippet}>
        </SnippetLayout>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
