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

// Helper functions (you should replace these with actual implementations)
async function fetchMediaInfo(mediaUrl: string) {
  const apiUrl = 'http://127.0.0.1:8000/api/grabit-fetch-media-info/retrieve_media_info/'

  const response = await fetch(apiUrl + '?media_url=' + encodeURIComponent(mediaUrl))
  const result = await response
  return result
}
