import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUUIDSlug } from '@/lib/utils/helpers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, comment, slug } = await req.json()

    // Find the code snippet using slug
    const snippet = await prisma.code_snippet.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!snippet) {
      return NextResponse.json({ error: 'Code snippet not found' }, { status: 404 })
    }

    // Create the comment
    const newComment = await prisma.code_snippet_comment.create({
      data: {
        name,
        email,
        comment,
        slug: generateUUIDSlug(),
        is_approved: false,
        created_at: new Date(),
        updated_at: new Date(),
        code_snippet: { connect: { id: snippet.id } }, // ✅ Connect using snippet ID
      },
    })

    return NextResponse.json(
      {
        message: 'Comment submitted for approval',
        comment: {
          ...newComment,
          id: newComment.id.toString(), // ✅ Convert BigInt to String
          code_snippet_id: newComment.code_snippet_id.toString(), // ✅ Convert BigInt to String
          created_at: newComment.created_at.toISOString(),
          updated_at: newComment.updated_at.toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in comment submission:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}
