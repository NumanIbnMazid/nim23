import { downloadMedia } from '@/lib/grabit/downloadMedia'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const processDownload = async (
  videoTitle: string,
  mediaTypeRef: React.RefObject<HTMLSelectElement>,
  mediaFormatRef: React.RefObject<HTMLSelectElement>,
  selectedFormatRef: React.RefObject<HTMLSelectElement>,
  bestAudioObject: any,
  downloadPathRef: React.RefObject<HTMLInputElement>,
  ffmpeg: any,
  setDownloadProgress: any,
  setStatusMessage: any
) => {
  const selectedMediaObject = JSON.parse(selectedFormatRef.current?.value || '{}')

  setDownloadProgress(0)
  setStatusMessage("Processing download.....")

  const downloadApiUrl =
    `${PUBLIC_SITE_URL}/api/grabit/media-download?` +
    `video_title=${encodeURIComponent(videoTitle.trim() || '')}&` +
    `media_type=${encodeURIComponent(mediaTypeRef.current?.value || '')}&` +
    `media_format=${encodeURIComponent(mediaFormatRef.current?.value || '')}&` +
    `selected_media_object=${encodeURIComponent(JSON.stringify(selectedMediaObject))}&` +
    `best_audio_object=${encodeURIComponent(JSON.stringify(bestAudioObject))}&` +
    `download_path=${encodeURIComponent(downloadPathRef.current?.value || '~/Downloads')}`

  const response = await fetch(downloadApiUrl)
  const data = await response.json()

  setDownloadProgress(5)

  const filteredTitle = data.data.video_title || videoTitle
  const videoUrl = data.data.video_url
  const audioUrl = data.data.audio_url
  const mediaType = mediaTypeRef.current?.value || 'video'
  const selectedMediaFormat = mediaFormatRef.current?.value || 'mp4'
  // const DownloadPath = data.data.download_path || '~/Downloads'
  const audioExt = data.data.audio_ext
  const videoExt = data.data.video_ext
  
  // Define the regex for valid filename characters
  // const validFilenameRegex = /[^a-zA-Z0-9-_ .]/g
  // // Filter the video title:
  // const filteredTitle = videoTitle
  //   .replace(validFilenameRegex, '') // Remove invalid characters
  //   .slice(0, 100) // Ensure the title doesn't exceed 100 characters
  const outputFileName = filteredTitle.replace(/\s+/g, '_')
  // Merge and download media
  const isSucceed = await downloadMedia(
    videoUrl,
    audioUrl,
    outputFileName,
    selectedMediaFormat,
    mediaType,
    audioExt,
    videoExt,
    ffmpeg,
    setDownloadProgress,
    setStatusMessage
  )
  return isSucceed
}
