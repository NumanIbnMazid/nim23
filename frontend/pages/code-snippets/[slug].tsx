import PageNotFound from "pages/404"
import { CodeSnippetType } from "@lib/types"
import SnippetLayout from "@layout/SnippetLayout"
import { useEffect, useState } from 'react'
import { getCodeSnippetDetails } from '@lib/backendAPI'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'

export default function SnippetPage({
  error,
  slug
}: {
  error: boolean
  slug: string
}) {
  if (error) return <PageNotFound />

  const [isLoading, setIsLoading] = useState(true)
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

  // ******* Loader *******
  if (isLoading === true) {
    return <Loader topic="Code Snippet" />
  }
  // ******* Loader *******

  // ******* No Data *******
  if (!code_snippet) {
    return <NoData topic="Code Snippet" />
  }
  // ******* No Data *******


  return (
    <>
      <Metadata
        title={code_snippet.title}
        description={code_snippet.overview || pageMeta.snippets.description}
        previewImage={code_snippet.image || pageMeta.snippets.image}
        keywords={`${code_snippet.language || "programming code snippets"}, ${pageMeta.snippets.keywords}`}
      />

      {code_snippet ? (

        <SnippetLayout code_snippet={code_snippet}>
        </SnippetLayout>
      ) : (
        <p>Loading...</p>
      )}
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
