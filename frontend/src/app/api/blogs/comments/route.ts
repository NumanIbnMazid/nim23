import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUUIDSlug } from '@/lib/utils/helpers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, comment, slug } = await req.json()

    // Find the blog using slug
    const blog = await prisma.blog.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Create the comment
    const newComment = await prisma.blog_comment.create({
      data: {
        name,
        email,
        comment,
        slug: generateUUIDSlug(),
        is_approved: false,
        created_at: new Date(),
        updated_at: new Date(),
        blog: { connect: { id: blog.id } }, // ✅ Connect using blog ID
      },
    })

    return NextResponse.json(
      {
        message: 'Comment submitted for approval',
        comment: {
          ...newComment,
          id: newComment.id.toString(), // ✅ Convert BigInt to String
          blog_id: newComment.blog_id.toString(), // ✅ Convert BigInt to String
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
