import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing video URL' }, { status: 400 })
  }

  try {
    const response = await fetch(videoUrl, {
      headers: { Origin: '*' }, // Some servers might allow this
    })
    const contentType = response.headers.get('content-type')

    return new Response(response.body, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
