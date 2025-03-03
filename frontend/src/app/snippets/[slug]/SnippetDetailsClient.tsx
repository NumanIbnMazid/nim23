'use client' // ✅ Ensure this runs only on the client

import { CodeSnippetType } from '@/lib/types'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'


const SnippetLayout = dynamic(() => import('@/layout/SnippetLayout'), {
  loading: () => <Loader />,
})

export default function SnippetDetailsClient({ snippet }: { snippet: CodeSnippetType }) {
  return <>{snippet ? <SnippetLayout code_snippet={snippet} /> : <NoData allowSpacing={true} />}</>
}
