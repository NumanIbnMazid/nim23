import { fetchFile } from '@ffmpeg/util'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const downloadMedia = async (
  videoFile: string,
  audioFile: string,
  outputFileName: string,
  mediaFormat: string,
  mediaType: string,
  ffmpeg: FFmpeg,
  setDownloadProgress: any,
  setStatusMessage: any
) => {
  try {
    setStatusMessage('Starting download....')

    const output_file = `${outputFileName}.${mediaFormat}`
    setDownloadProgress(20) // Update progress

    // Write files to FFmpeg's virtual file system
    const videoProxyUrl = `${PUBLIC_SITE_URL}/api/grabit/proxy?url=${encodeURIComponent(videoFile)}`
    const audioProxyUrl = `${PUBLIC_SITE_URL}/api/grabit/proxy?url=${encodeURIComponent(audioFile)}`

    setStatusMessage('Fetching video and audio.....')
    setStatusMessage('Please hold on. This may take a while. Rest of the process will be very quick.')

    // ======= Hard Part ========
    const [videoData, audioData] = await Promise.all([fetchFile(videoProxyUrl), fetchFile(audioProxyUrl)])
    // ======= Hard Part ========

    setDownloadProgress(60) // Update progress

    setStatusMessage('Writing files.....')
    await Promise.all([ffmpeg.writeFile('input.mp4', videoData), ffmpeg.writeFile('input.m4a', audioData)])

    setDownloadProgress(70) // Update progress

    setStatusMessage('Preparing video and audio....')

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-i',
      'input.m4a',
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      output_file,
    ])

    setStatusMessage('File is ready....')

    setDownloadProgress(80) // Update progress

    const data = (await ffmpeg.readFile(output_file)) as any

    setDownloadProgress(90) // Update progress

    const videoUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: mediaType === 'video' ? `video/${mediaFormat}` : `audio/${mediaFormat}` })
    )
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = output_file
    link.click()

    setDownloadProgress(100) // Update progress

    setStatusMessage('Download completed ....')

    // Clean up
    URL.revokeObjectURL(videoUrl)

    return true
  } catch (error) {
    throw new Error(`Failed to download media file! ${error}`)
  }
}
