import PageNotFound from "pages/404"
import { CodeSnippetType } from "@lib/types"
import { useEffect, useState } from 'react'
import { getCodeSnippetDetails } from '@lib/backendAPI'
import Loader from "@components/Loader"
import NoData from "@components/NoData"
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'
import dynamic from 'next/dynamic'
import { useClientID } from '@context/clientIdContext'

const SnippetLayout = dynamic(() => import('@layout/SnippetLayout'), {
  loading: () => <Loader />,
})

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
  const { clientID } = useClientID()

  const fetchCodeSnippetDetail = async (slug: any) => {
    try {
      if (!clientID) return
      const codeSnippetData: CodeSnippetType = await getCodeSnippetDetails(clientID, slug)
      setCodeSnippet(codeSnippetData)
    } catch (error) {
      // Handle error case
      console.error(error)
    }
  }

  function stripHtml(html: string) {
    const strippedText = html.replace(/<[^>]*>/g, '') // Removes all HTML tags
    return strippedText
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

  const snippetOverview = code_snippet?.overview ? stripHtml(code_snippet.overview) : undefined


  return (
    <>
      <Metadata
        title={code_snippet?.title || pageMeta.snippets.title}
        description={snippetOverview || pageMeta.snippets.description}
        previewImage={code_snippet?.image || pageMeta.snippets.image}
        keywords={`${code_snippet?.tags || "programming code snippets"}, ${pageMeta.snippets.keywords}`}
      />

      {isLoading ? (
        <Loader />
      ) : code_snippet ? (
        <SnippetLayout code_snippet={code_snippet} />
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
    },
  }
}
