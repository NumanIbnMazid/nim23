import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import { HomeHeading } from '@/app/HomeClient'
import { loadFFmpeg } from '@/lib/grabit/loadFFmpeg'
import { fetchMediaDetails } from '@/lib/grabit/fetchMediaDetails'
import { updateFormatOptions } from '@/lib/grabit/updateFormatOptions'
import { processDownload } from '@/lib/grabit/processDownload'
import MediaInput from '@/components/Grabit/MediaInput'
import MediaInfo from '@/components/Grabit/MediaInfo'
import MediaType from '@/components/Grabit/MediaType'
import MediaSelect from '@/components/Grabit/MediaSelect'
import MediaFormat from '@/components/Grabit/MediaFormat'
import DownloadButton from '@/components/Grabit/DownloadButton'
import FFmpegLoadingButton from '@/components/Grabit/FFmpegLoadingButton'
import StatusMessage from '@/components/Grabit/StatusMessage'
import ErrorMessage from '@/components/Grabit/ErrorMessage'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import AnimatedText from '@/components/FramerMotion/AnimatedText'
import { opacityVariant } from '@/content/FramerMotionVariants'

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
      setFfmpegLoading(false)
      setFfmpegLoaded(true)
    } catch (error) {
      setError(`${error}`)
      setFfmpegLoading(false)
      setFfmpegLoaded(false)
    }
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
    setMediaData(null)
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
      setStatusMessage('')
      const message = error instanceof Error ? error.message : 'Unknown error!'
      setError(message)
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
          <div className={`w-full flex flex-col items-center justify-center gap-3 py-2 select-none`}>
            <AnimatedText variants={opacityVariant} className="text-md text-gray-600 dark:text-gray-400">
              <span className='pe-1'>
                <span className="font-bold">Copyrighted</span> and <span className="font-bold">Age Restricted</span>{' '}
                content is not available for download with this tool
              </span>
              <span className="relative group inline-block ml-1">
                <svg
                  className="w-4 h-4 text-gray-500 cursor-pointer"
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 958.016611c-245.919634 0-446.016611-200.064292-446.016611-446.016611 0-245.919634 200.095256-446.016611 446.016611-446.016611 245.952318 0 446.016611 200.064292 446.016611 446.016611S757.952318 958.016611 512 958.016611zM512 129.983389c-210.655557 0-382.016611 171.359333-382.016611 382.016611 0 210.624593 171.359333 382.016611 382.016611 382.016611 210.624593 0 382.016611-171.359333 382.016611-382.016611S722.624593 129.983389 512 129.983389z" />
                  <path d="M463.99957 304.00043c0 26.509985 21.490445 48.00043 48.00043 48.00043s48.00043-21.490445 48.00043-48.00043-21.490445-48.00043-48.00043-48.00043S463.99957 277.490445 463.99957 304.00043z" />
                  <path d="M512 768c-17.664722 0-32.00086-14.303454-32.00086-32.00086L479.99914 448c0-17.664722 14.336138-32.00086 32.00086-32.00086s32.00086 14.336138 32.00086 32.00086l0 287.99914C544.00086 753.696546 529.664722 768 512 768z" />
                </svg>

                <div className="absolute top-full left-1/2 z-10 w-72 -translate-x-1/2 mt-2 rounded-md bg-gray-800 text-white text-xs px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  By choosing to download, you acknowledge that the audio or video content you are accessing is for
                  personal and non-commercial use only. You agree not to distribute, copy, modify or otherwise use the
                  downloaded content for any commercial purpose, including but not limited to resale, public
                  performance or broadcast. Any use of the content beyond the scope of these terms may result in a
                  violation of applicable copyright law and the Terms of Service.
                </div>
              </span>
            </AnimatedText>
          </div>

          <div className="items-center my-4 dark:text-gray-300">
            <motion.div initial="hidden" whileInView="visible" variants={FadeContainer} viewport={{ once: true }}>
              <MediaInput mediaUrlRef={mediaUrlRef} fetchMediaDetails={fetchDetails} loading={fetchMediaLoading} />
              {mediaData && (
                <div>
                  <MediaInfo mediaInfo={mediaData} videoUrl={mediaUrlRef.current?.value || ''} />
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
                </div>
              )}
            </motion.div>
            <StatusMessage statusMessage={statusMessage} />
            <ErrorMessage error={error} />
          </div>
        </section>
      </motion.section>
    </div>
  )
}
