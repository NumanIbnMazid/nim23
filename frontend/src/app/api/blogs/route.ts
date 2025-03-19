import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/api/blogs/blogs'
import { jsonBigIntReplacer } from '@/lib/utils/helpers'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 })
    }

    const blogs = await getAllBlogs(limit)
    return new NextResponse(JSON.stringify(blogs, jsonBigIntReplacer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
