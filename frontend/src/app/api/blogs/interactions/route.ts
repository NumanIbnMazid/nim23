import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUUIDSlug } from '@/lib/utils/helpers'

export async function GET(req: NextRequest) {
  try {
    // console.log("✅ Blog interactions API called *****");
    
    const url = new URL(req.url)
    const blogSlug = url.searchParams.get('slug') // ✅ Blog slug
    const clientID = url.searchParams.get('clientID')
    const action = url.searchParams.get('action') // ✅ 'view' or 'like'

    if (!blogSlug || !clientID) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // ✅ Ensure the blog exists
    const blog = await prisma.blog.findUnique({
      where: { slug: blogSlug },
      select: { id: true },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const blogID = BigInt(blog.id) // ✅ Convert to BigInt for Prisma

    // ✅ Check if the user has already interacted with the blog
    const existingInteraction = await prisma.blog_view.findFirst({
      where: { clientID, blog_id: blogID },
    })

    const blogViewSlug = existingInteraction ? existingInteraction.slug : generateUUIDSlug()

    if (!existingInteraction) {
      await prisma.blog_view.create({
        data: {
          clientID,
          slug: blogViewSlug,
          blog_id: blogID,
          first_visited_at: new Date(),
          last_visited_at: new Date(),
          liked: false,
        },
      })
    } else {
      await prisma.blog_view.update({
        where: { id: existingInteraction.id },
        data: { last_visited_at: new Date() },
      })
    }

    let userLiked = existingInteraction?.liked || false

    if (action === 'like') {
      userLiked = !userLiked
      await prisma.blog_view.update({
        where: { id: existingInteraction?.id },
        data: { liked: userLiked },
      })
    }

    const totalViews = await prisma.blog_view.count({ where: { blog_id: blogID } })
    const totalLikes = await prisma.blog_view.count({ where: { blog_id: blogID, liked: true } })

    return NextResponse.json(
      { total_views: totalViews, total_likes: totalLikes, user_liked: userLiked },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in blog interactions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
