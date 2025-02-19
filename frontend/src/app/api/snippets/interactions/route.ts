import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUUIDSlug } from '@/lib/utils/helpers'

export async function GET(req: NextRequest) {
  try {
    // console.log('✅ Snippet interactions API called *****')
    const url = new URL(req.url)
    const snippetSlug = url.searchParams.get('slug') // ✅ Snippet slug
    const clientID = url.searchParams.get('clientID')
    const action = url.searchParams.get('action') // ✅ 'view' or 'like'

    if (!snippetSlug || !clientID) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // ✅ Ensure the snippet exists
    const codeSnippet = await prisma.code_snippet.findUnique({
      where: { slug: snippetSlug },
      select: { id: true },
    })

    if (!codeSnippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    const snippetID = BigInt(codeSnippet.id) // ✅ Convert to BigInt for Prisma

    // ✅ Check if the user has already interacted with the snippet
    const existingInteraction = await prisma.code_snippet_view.findFirst({
      where: { clientID, code_snippet_id: snippetID },
    })

    const snippetViewSlug = existingInteraction ? existingInteraction.slug : generateUUIDSlug()

    if (!existingInteraction) {
      await prisma.code_snippet_view.create({
        data: {
          clientID,
          slug: snippetViewSlug,
          code_snippet_id: snippetID,
          first_visited_at: new Date(),
          last_visited_at: new Date(),
          liked: false,
        },
      })
    } else {
      await prisma.code_snippet_view.update({
        where: { id: existingInteraction.id },
        data: { last_visited_at: new Date() },
      })
    }

    let userLiked = existingInteraction?.liked || false

    if (action === 'like') {
      userLiked = !userLiked
      await prisma.code_snippet_view.update({
        where: { id: existingInteraction?.id },
        data: { liked: userLiked },
      })
    }

    const totalViews = await prisma.code_snippet_view.count({ where: { code_snippet_id: snippetID } })
    const totalLikes = await prisma.code_snippet_view.count({ where: { code_snippet_id: snippetID, liked: true } })

    return NextResponse.json(
      { total_views: totalViews, total_likes: totalLikes, user_liked: userLiked },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in snippet interactions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
