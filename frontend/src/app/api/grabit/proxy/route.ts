import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing video URL' }, { status: 400 })
  }

  try {
    const response = await fetch(videoUrl, {
      headers: { Origin: '*' },
    })

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
