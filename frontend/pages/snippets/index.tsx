import { AnimatePresence } from 'framer-motion'
import { FadeContainer } from '@content/FramerMotionVariants'
import Metadata from '@components/MetaData'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import PageTop from '@components/PageTop'
import pageMeta from '@content/meta'
import { useEffect, useState } from 'react'
import { CodeSnippetType } from '@lib/types'
import Loader from '@components/Loader'
import NoData from '@components/NoData'
import dynamic from 'next/dynamic'
import { useClientID } from '@context/clientIdContext'
import { getOrSetClientID } from '@lib/clientIDManager'

const SnippetCard = dynamic(() => import('@components/SnippetCard'), {
  loading: () => <Loader />,
})

export default function CodeSnippets() {
  const [isLoading, setIsLoading] = useState(true)
  const [code_snippets, setCodeSnippets] = useState<CodeSnippetType[]>([])
  const { clientID } = useClientID()

  const fetchCodeSnippets = async (clientIDParam: string) => {
    try {
      const response = await fetch(`/api/snippets/list?clientID=${encodeURIComponent(clientIDParam)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const code_snippetsData: CodeSnippetType[] = await response.json()
      setCodeSnippets(code_snippetsData)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const clientIDParam = clientID || getOrSetClientID()
      await Promise.all([fetchCodeSnippets(clientIDParam)])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <>
      <Metadata
        title={pageMeta.snippets.title}
        description={pageMeta.snippets.description}
        previewImage={pageMeta.snippets.image}
        keywords={pageMeta.snippets.keywords}
      />

      {isLoading ? (
        <Loader />
      ) : code_snippets && code_snippets.length > 0 ? (
        <section className="pageTop flex flex-col gap-2 bg-darkWhitePrimary dark:bg-darkPrimary">
          <PageTop pageTitle={pageMeta.snippets.title}>{pageMeta.snippets.description}</PageTop>

          <section className="relative flex flex-col gap-2 min-h-[50vh]">
            <AnimatedDiv variants={FadeContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <AnimatePresence>
                {code_snippets.map((code_snippet, index) => {
                  return <SnippetCard key={index} code_snippet={code_snippet} />
                })}
              </AnimatePresence>
            </AnimatedDiv>
          </section>
        </section>
      ) : (
        <div className="mt-16">
          <NoData />
        </div>
      )}
    </>
  )
}
