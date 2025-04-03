import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { HomeHeading } from '@/app/HomeClient'
import { loadFFmpeg } from '@/lib/grabit/loadFFmpeg'
import { fetchMediaDetails } from '@/lib/grabit/fetchMediaDetails'
import { updateFormatOptions } from '@/lib/grabit/updateFormatOptions'
import { processDownload } from '@/lib/grabit/processDownload'
import MediaInput from '@/components/Grabit/MediaInput'
import MediaType from '@/components/Grabit/MediaType'
import MediaSelect from '@/components/Grabit/MediaSelect'
import MediaFormat from '@/components/Grabit/MediaFormat'
import DownloadButton from '@/components/Grabit/DownloadButton'
import FFmpegLoadingButton from '@/components/Grabit/FFmpegLoadingButton'
import StatusMessage from '@/components/Grabit/StatusMessage'
import { FFmpeg } from '@ffmpeg/ffmpeg'

export default function GrabitPage() {
  const [fetchMediaLoading, setFetchMediaLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [ffmpegLoading, setFfmpegLoading] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [statusMessage, setStatusMessage] = useState<string>('')

  const [error, setError] = useState('')

  const [mediaData, setMediaData] = useState<any>(null)
  const [formats, setFormats] = useState<any[]>([])

  const mediaUrlRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>
  const selectedFormatRef = useRef<HTMLSelectElement>(null) as React.RefObject<HTMLSelectElement>
  const mediaTypeRef = useRef<HTMLSelectElement>(null) as React.RefObject<HTMLSelectElement>
  const mediaFormatRef = useRef<HTMLSelectElement>(null) as React.RefObject<HTMLSelectElement>
  const downloadPathRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>

  const ffmpegRef = useRef(new FFmpeg())

  const loadFFmpegHandler = async () => {
    setFfmpegLoading(true)
    try {
      await loadFFmpeg(ffmpegRef.current, setStatusMessage)
      setFfmpegLoading(true)
    } catch (error) {
      setError(`${error}`)
    }
    setFfmpegLoading(false)
    setFfmpegLoaded(true)
  }

  // Reset statusMessage
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(''), 50000)
      return () => clearTimeout(timer) // Cleanup timer on unmount or statusMessage change
    }
  }, [statusMessage])

  const downloadLoadHandler = async () => {
    setDownloadLoading(true)
    setDownloadProgress(0)
    setStatusMessage('')
    setError('')

    const mediaTitle = mediaData?.title || ''
    const bestAudioObject = mediaData?.formats_filtered?.best_audio || {}

    try {
      await processDownload(
        mediaTitle,
        mediaTypeRef,
        mediaFormatRef,
        selectedFormatRef,
        bestAudioObject,
        downloadPathRef,
        ffmpegRef.current,
        setDownloadProgress,
        setStatusMessage
      )
      setDownloadLoading(false)
    } catch (error) {
      setDownloadLoading(false)
      setError(`${error}`)
    }
    setDownloadLoading(false)
  }

  const fetchDetails = async () => {
    setError('')
    setStatusMessage('')
    if (!mediaUrlRef.current) return

    setFetchMediaLoading(true)
    try {
      const mediaDetails = await fetchMediaDetails(mediaUrlRef.current.value, setStatusMessage)
      setMediaData(mediaDetails)
      const formats = updateFormatOptions('video', mediaDetails)
      setFormats(formats)
    } catch (error) {
      setError(`${error}`)
    }
    setFetchMediaLoading(false)
  }

  const handleFormatOptionsUpdate = () => {
    if (mediaData && mediaTypeRef.current) {
      const formats = updateFormatOptions(mediaTypeRef.current.value, mediaData)
      setFormats(formats)
    }
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
          <HomeHeading title="Grabit" />
          <MediaInput mediaUrlRef={mediaUrlRef} fetchMediaDetails={fetchDetails} loading={fetchMediaLoading} />
          {mediaData && (
            <div>
              <MediaType
                mediaData={mediaData}
                mediaTypeRef={mediaTypeRef}
                updateFormatOptions={handleFormatOptionsUpdate}
              />
              <MediaSelect formats={formats} selectedFormatRef={selectedFormatRef} />
              <MediaFormat mediaTypeRef={mediaTypeRef} mediaFormatRef={mediaFormatRef} />
              {ffmpegLoaded ? (
                <DownloadButton
                  downloadMedia={downloadLoadHandler}
                  selectedFormatRef={selectedFormatRef}
                  loading={downloadLoading}
                  progress={downloadProgress}
                />
              ) : (
                <FFmpegLoadingButton load={loadFFmpegHandler} isLoading={ffmpegLoading} />
              )}

              <StatusMessage statusMessage={statusMessage} />
              <p className="text-red-500 text-center mt-2">{error}</p>
            </div>
          )}
        </section>
      </motion.section>
    </div>
  )
}
