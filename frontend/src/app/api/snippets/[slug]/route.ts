import { NextResponse } from 'next/server'
import { getSnippetBySlug } from '@/lib/api/snippets/snippetDetails'
import { jsonBigIntReplacer } from '@/lib/utils/helpers'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params // ✅ Ensure params is awaited before use

    const snippet = await getSnippetBySlug(slug)

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    return new NextResponse(JSON.stringify(snippet, jsonBigIntReplacer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching snippet:', error)
    return NextResponse.json({ error: 'Failed to fetch snippet' }, { status: 500 })
  }
}
