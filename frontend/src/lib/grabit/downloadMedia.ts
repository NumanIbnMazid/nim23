import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFileInChunks } from '@/lib/grabit/fetchFileInChunks'
import { formatBytes } from '@/lib/utils/helpers'

export const downloadMedia = async (
  videoFile: string,
  audioFile: string,
  outputFileName: string,
  mediaFormat: string,
  mediaType: string,
  audioExt: string,
  videoExt: string,
  ffmpeg: FFmpeg,
  setDownloadProgress: any,
  setStatusMessage: any
) => {
  try {
    setStatusMessage('Starting download....')

    const chunkSize = 1024 * 1024 * 2 // 2MB per chunk
    const output_file = `${outputFileName}.${mediaFormat}`

    setDownloadProgress(10) // Update progress

    setStatusMessage('Fetching video and audio.....')
    setStatusMessage('Please hold on. This may take a while. Rest of the process will be very quick.')

    // ======= Heavy Part ========
    // const [videoData, audioData] = await Promise.all([fetchFile(videoProxyUrl), fetchFile(audioProxyUrl)])

    let videoProgress = 0
    let audioProgress = 0
    let videoDownloaded = 0
    let audioDownloaded = 0
    let videoTotal = 0
    let audioTotal = 0

    const updateOverallProgress = () => {
      // *** Progress ***
      const totalProgress = (videoProgress + audioProgress) / 2
      // Progress from 10% to 80%
      const progressValue = Math.floor(10 + totalProgress * 80)
      setDownloadProgress(progressValue)
      // *** Size ***
      const totalSize = videoTotal + audioTotal
      const downloadedSize = videoDownloaded + audioDownloaded
      const totalSizeFormatted = formatBytes(totalSize)
      const downloadedSizeFormatted = formatBytes(downloadedSize)
      setStatusMessage(`Content Downloaded: ${downloadedSizeFormatted} / ${totalSizeFormatted}`)
    }

    // Dynamically create the promises array based on the mediaType
    const fetchPromises = []
    fetchPromises.push(
      fetchFileInChunks(audioFile, chunkSize, (p, downloaded, total) => {
        audioProgress = p
        audioDownloaded = downloaded
        audioTotal = total
        updateOverallProgress()
      })
    )
    if (mediaType === 'video') {
      fetchPromises.push(
        fetchFileInChunks(videoFile, chunkSize, (p, downloaded, total) => {
          videoProgress = p
          videoDownloaded = downloaded
          videoTotal = total
          updateOverallProgress()
        })
      )
    }
    const [videoData, audioData] = await Promise.all(fetchPromises)

    // ======= Hard Part ========

    setDownloadProgress(80) // Update progress

    setStatusMessage('Writing files.....')

    const writePromises = []
    writePromises.push(ffmpeg.writeFile(`input.${audioExt}`, audioData))
    if (mediaType === 'video') {
      writePromises.push(ffmpeg.writeFile(`input.${videoExt}`, videoData))
    }
    await Promise.all(writePromises)

    setDownloadProgress(85) // Update progress

    setStatusMessage('Preparing video and audio....')

    // FFmpeg command depends on media type
    const ffmpegArgs =
      mediaType === 'video'
        ? [
            '-i',
            `input.${videoExt}`,
            '-i',
            `input.${audioExt}`,
            '-c:v',
            'copy',
            '-c:a',
            'copy',
            '-strict',
            'experimental',
            output_file,
          ]
        : ['-i', `input.${audioExt}`, '-c:a', 'copy', '-strict', 'experimental', output_file] // For audio, no video input

    await ffmpeg.exec(ffmpegArgs)

    setStatusMessage('File is ready....')

    setDownloadProgress(90) // Update progress

    const data = (await ffmpeg.readFile(output_file)) as any

    setDownloadProgress(95) // Update progress

    const videoUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: mediaType === 'video' ? `video/${mediaFormat}` : `audio/${mediaFormat}` })
    )
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = output_file
    link.click()

    setDownloadProgress(100) // Update progress

    setStatusMessage('Download complete! ✅')

    // Clean up
    URL.revokeObjectURL(videoUrl)

    return true
  } catch (error) {
    throw new Error(`Failed to download media file! ${error}`)
  }
}
