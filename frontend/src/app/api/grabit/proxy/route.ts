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

    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Cache-Control', 'no-cache')

    // Forward Content-Length if available
    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
