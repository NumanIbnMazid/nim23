import { NextResponse } from 'next/server'

// Fetch media info
export async function GET(req: Request) {
  const url = new URL(req.url)
  const mediaUrl = url.searchParams.get('media_url')

  if (!mediaUrl) {
    return NextResponse.json({ success: false, error: 'Missing media_url parameter' })
  }

  try {
    // Call your backend logic to fetch media info here
    const mediaInfo = await fetchMediaInfo(mediaUrl)

    if (mediaInfo) {
      return mediaInfo
    } else {
      return NextResponse.json({ success: false, error: 'Failed to retrieve media info' })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error fetching media details: ' + (error instanceof Error ? error.message : 'Unknown error'),
    })
  }
}

async function fetchMediaInfo(mediaUrl: string) {
  const apiUrl = `${process.env.BACKEND_API_BASE_URL}/grabit-fetch-media-info/details/`

  const response = await fetch(apiUrl + '?media_url=' + encodeURIComponent(mediaUrl))
  const result = await response
  return result
}