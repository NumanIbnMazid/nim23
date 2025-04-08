import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing video URL' }, { status: 400 })
  }

  try {
    const range = req.headers.get('range')
    const headers: HeadersInit = { Origin: '*' }
    if (range) headers['Range'] = range

    const response = await fetch(videoUrl, {
      headers,
    })

    const proxyHeaders = new Headers()
    proxyHeaders.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream')
    proxyHeaders.set('Access-Control-Allow-Origin', '*')
    proxyHeaders.set('Cache-Control', 'no-cache')

    // Forward Content-Length if available
    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      proxyHeaders.set('Content-Length', contentLength)
    }

    if (range) {
      const contentRange = response.headers.get('content-range')
      if (contentRange) {
        proxyHeaders.set('Content-Range', contentRange)
        proxyHeaders.set('Accept-Ranges', 'bytes')
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: proxyHeaders,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
