'use client' // ✅ Ensure this runs only on the client

import { CodeSnippetType } from '@/lib/types'
import NoData from '@/components/NoData'
import SnippetLayout from '@/layout/SnippetLayout'

export default function SnippetDetailsClient({ snippet }: { snippet: CodeSnippetType }) {
  return <>{snippet ? <SnippetLayout code_snippet={snippet} /> : <NoData allowSpacing={true} />}</>
}
