import { downloadMedia } from '@/lib/grabit/downloadMedia'

export const processDownload = async (
  mediaUrlRef: React.RefObject<HTMLInputElement>,
  formatSelectRef: React.RefObject<HTMLSelectElement>,
  mediaTypeRef: React.RefObject<HTMLSelectElement>,
  ffmpeg: any
) => {
  const selectedFormat = JSON.parse(formatSelectRef.current?.value || '{}')

  const downloadApiUrl =
    `/api/grabit/media-download?` +
    `media_url=${encodeURIComponent(mediaUrlRef.current?.value.trim() || '')}&` +
    `media_type=${encodeURIComponent(mediaTypeRef.current?.value || '')}&` +
    `raw_data=${encodeURIComponent(JSON.stringify(selectedFormat))}&` +
    `download_path=${encodeURIComponent('~/Documents')}`

  const response = await fetch(downloadApiUrl)
  const data = await response.json()
  const videoUrl = data.data.video_url
  const audioUrl = data.data.audio_url
  const videoTitle = data.data.video_title
  const mediaFormat = data.data.target_media_format || 'mp4'
  const mediaType = data.data.target_media_type || 'video'
  // const audio_ext = data.data.audio_ext
  // const video_ext = data.data.video_ext
  // Define the regex for valid filename characters
  const validFilenameRegex = /[^a-zA-Z0-9-_ .]/g
  // Filter the video title:
  const filteredTitle = videoTitle
    .replace(validFilenameRegex, '') // Remove invalid characters
    .slice(0, 100) // Ensure the title doesn't exceed 100 characters
  const outputFileName = filteredTitle.replace(/\s+/g, '_')  
  // Merge and download media
  const isSucceed = await downloadMedia(videoUrl, audioUrl, outputFileName, mediaFormat, mediaType, ffmpeg)
  return isSucceed
}
