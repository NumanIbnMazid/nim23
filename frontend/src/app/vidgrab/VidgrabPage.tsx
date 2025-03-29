'use client'

import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { HomeHeading } from '@/app/HomeClient'
import React, { useState, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface MediaFormat {
  format_details: string
  ext: string
}

interface MediaData {
  title: string
  formats_filtered: {
    best_video: MediaFormat
    video_formats: MediaFormat[]
    best_audio: MediaFormat
    audio_formats: MediaFormat[]
  }
}

const VidgrabPage: React.FC = () => {
  const [mediaData, setMediaData] = useState<MediaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaUrlRef = useRef<HTMLInputElement>(null)
  const formatSelectRef = useRef<HTMLSelectElement>(null)
  const mediaTypeRef = useRef<HTMLSelectElement>(null)

  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)

  const load = async () => {
    setIsLoading(true)
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`/scripts//ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/scripts//ffmpeg-core.wasm`, 'application/wasm'),
    })
    setLoaded(true)
    setIsLoading(false)
  }

  const fetchMediaDetails = async () => {
    const url = mediaUrlRef.current?.value.trim()
    if (!url) {
      alert('Please enter a valid video URL.')
      return
    }

    const apiUrl = '/api/vidgrab/media-details'

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}?media_url=${encodeURIComponent(url)}`)
      const result = await response.json()
      if (result.success && result.data.media_info) {
        setMediaData(result.data.media_info)
      } else {
        setError('Error fetching video details: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      setError('Failed to fetch media details: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const updateFormatOptions = () => {
    const type = mediaTypeRef.current?.value
    const formatSelect = formatSelectRef.current

    if (!mediaData) {
      alert('Please fetch video details first.')
      return
    }

    let formats: MediaFormat[] = []
    if (type === 'video') {
      formats.push(mediaData.formats_filtered.best_video)
      formats = formats.concat(mediaData.formats_filtered.video_formats)
    } else if (type === 'audio') {
      formats.push(mediaData.formats_filtered.best_audio)
      formats = formats.concat(mediaData.formats_filtered.audio_formats)
    }

    formats = formats.filter(Boolean) // Remove null/undefined values
    if (formatSelect) {
      formatSelect.innerHTML = '' // Reset the formats list
    }

    formats.forEach((format) => {
      const option = document.createElement('option')
      option.value = JSON.stringify(format)
      option.textContent = `${format.format_details} (${format.ext})`
      formatSelect?.appendChild(option)
    })
  }

  const downloadFile = async (
    videoFile: string,
    audioFile: string,
    outputFileName: string,
    mediaFormat: string,
    mediaType: string
  ) => {
    const output_file = `${outputFileName}.${mediaFormat}`
    const ffmpeg = ffmpegRef.current

    // Write files to FFmpeg's virtual file system
    const videoProxyUrl = `/api/vidgrab/proxy?url=${encodeURIComponent(videoFile)}`
    const audioProxyUrl = `/api/vidgrab/proxy?url=${encodeURIComponent(audioFile)}`

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
  }

  const downloadMedia = async () => {
    const selectedFormat = JSON.parse(formatSelectRef.current?.value || '{}') as MediaFormat
    if (!selectedFormat) {
      alert('Please select a format to download.')
      return
    }
    // Construct the API URL for downloading media
    const downloadApiUrl =
      `/api/vidgrab/media-download?` +
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
    await downloadFile(videoUrl, audioUrl, outputFileName, mediaFormat, mediaType)
  }

  return (
    <div className="dark:bg-darkPrimary dark:text-gray-100">
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="pageTop"
      >
        <section>
          <HomeHeading title="Vidgrab App" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="mb-10 mt-4 px-7 py-4 transform rounded-lg border-gray-300 sm:justify-start dark:border-neutral-700"
          >
            <p ref={messageRef}></p>
            {loaded ? (
              <div className="">
                <div className="max-w-full prose dark:prose-invert">
                  <h2 className="text-xl font-bold">Media Downloader</h2>

                  <label htmlFor="mediaUrl" className="block mt-4">
                    Enter Video URL:
                  </label>
                  <input
                    type="text"
                    id="mediaUrl"
                    ref={mediaUrlRef}
                    placeholder="Enter video URL"
                    defaultValue="https://www.youtube.com/watch?v=OfIQW6s1-ew&ab_channel=anewone5"
                    className="input input-bordered w-full mt-2"
                  />

                  <button onClick={fetchMediaDetails} disabled={loading} className="btn btn-primary mt-2">
                    {loading ? 'Fetching...' : 'Get Video Details'}
                  </button>

                  {error && <p className="text-red-500 mt-2">{error}</p>}

                  <div id="videoContainer" className="mt-4"></div>

                  {mediaData && (
                    <>
                      <label htmlFor="mediaType" className="block mt-4">
                        Select Media Type:
                      </label>
                      <select
                        id="mediaType"
                        ref={mediaTypeRef}
                        onChange={updateFormatOptions}
                        className="select select-bordered w-full mt-2"
                      >
                        <option value="">-- Choose Type --</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>

                      <div id="formatsContainer" className="mt-4">
                        <label htmlFor="formatSelect" className="block">
                          Select Format:
                        </label>
                        <select
                          id="formatSelect"
                          ref={formatSelectRef}
                          className="select select-bordered w-full mt-2"
                        ></select>

                        <button onClick={downloadMedia} disabled={loading} className="btn btn-success mt-4">
                          {loading ? 'Processing...' : 'Download'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="fixed mb-10 mt-4 px-7 py-4 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={load}
              >
                Load ffmpeg-core
                {isLoading && (
                  <span className="animate-spin ml-3">
                    <svg
                      viewBox="0 0 1024 1024"
                      focusable="false"
                      data-icon="loading"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                    </svg>
                  </span>
                )}
              </button>
            )}
          </motion.div>
        </section>
      </motion.section>
    </div>
  )
}

export default VidgrabPage
