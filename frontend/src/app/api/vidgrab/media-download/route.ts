import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mediaUrl = url.searchParams.get('media_url')
  const mediaType = url.searchParams.get('media_type')
  const rawData = url.searchParams.get('raw_data')
  const downloadPath = url.searchParams.get('download_path')

  if (!mediaUrl || !mediaType || !rawData) {
    return NextResponse.json({ success: false, error: 'Missing required parameters' })
  }

  try {
    // Parse the raw data for the selected format
    const selectedFormat = JSON.parse(rawData)

    // Call your backend logic to download the media
    const mediaDownloadData = await downloadMediaInfo(mediaUrl, mediaType, selectedFormat, downloadPath || '')

    if (mediaDownloadData) {
      return mediaDownloadData
    } else {
      return NextResponse.json({ success: false, error: 'Failed to download media' })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process media download: ' + (error instanceof Error ? error.message : 'Unknown error'),
    })
  }
}

async function downloadMediaInfo(mediaUrl: string, mediaType: string, selectedFormat: any, downloadPath: string) {
  // Construct the API URL for downloading media
  const downloadApiUrl =
    `http://127.0.0.1:8000/api/grabit-download/media-download-info?` +
    `media_url=${encodeURIComponent(mediaUrl)}&` +
    `media_type=${encodeURIComponent(mediaType)}&` +
    `raw_data=${encodeURIComponent(JSON.stringify(selectedFormat))}&` +
    `download_path=${encodeURIComponent(downloadPath)}`

  const response = await fetch(downloadApiUrl)
  return response
}
