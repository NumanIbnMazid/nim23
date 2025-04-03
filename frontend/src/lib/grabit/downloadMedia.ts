import { fetchFile } from '@ffmpeg/util'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { PUBLIC_SITE_URL } from '@/lib/constants'

export const downloadMedia = async (
  videoFile: string,
  audioFile: string,
  outputFileName: string,
  mediaFormat: string,
  mediaType: string,
  ffmpeg: FFmpeg
) => {
  try {
    console.log("Starting download....");
    
    const output_file = `${outputFileName}.${mediaFormat}`

    // Write files to FFmpeg's virtual file system
    const videoProxyUrl = `${PUBLIC_SITE_URL}/api/grabit/proxy?url=${encodeURIComponent(videoFile)}`
    const audioProxyUrl = `${PUBLIC_SITE_URL}/api/grabit/proxy?url=${encodeURIComponent(audioFile)}`

    await ffmpeg.writeFile('input.mp4', await fetchFile(videoProxyUrl))
    await ffmpeg.writeFile('input.m4a', await fetchFile(audioProxyUrl))

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

    const data = (await ffmpeg.readFile(output_file)) as any
    const videoUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: mediaType === 'video' ? `video/${mediaFormat}` : `audio/${mediaFormat}` })
    )
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = output_file
    link.click()
    // Clean up
    URL.revokeObjectURL(videoUrl)

    return true
  } catch (error) {
    throw new Error('Failed to download media')
  }
}
