import PageNotFound from "pages/404"
import { CodeSnippetType } from "@lib/types"
import SnippetLayout from "@layout/SnippetLayout"
// import pageMeta from "@content/meta"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCodeSnippetDetails } from '@lib/backendAPI'
import Loader from "@components/Loader"
import NoData from "@components/NoData"

export default function SnippetPage({
  error,
}: {
  error: boolean;
}) {
  if (error) return <PageNotFound />

  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { slug } = router.query // Retrieve the slug parameter from the URL

  const [code_snippet, setCodeSnippet] = useState<CodeSnippetType>()

  const fetchCodeSnippetDetail = async (slug: any) => {
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
    const fetchData = async () => {
      await Promise.all([
        fetchCodeSnippetDetail(slug)
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
  if (!code_snippet) {
    return (
      <NoData topic="Code Snippet" />
    )
  }
  // ******* No Data Check *******


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
