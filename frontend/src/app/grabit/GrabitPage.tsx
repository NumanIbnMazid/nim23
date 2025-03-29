import React, { useState, useRef } from 'react'
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
import DownloadButton from '@/components/Grabit/DownloadButton'
import FFmpegLoadingButton from '@/components/Grabit/FFmpegLoadingButton'
import FFmpegMessage from '@/components/Grabit/FFmpegMessage'
import { FFmpeg } from '@ffmpeg/ffmpeg'

export default function GrabitPage() {
  const [fetchMediaLoading, setFetchMediaLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [ffmpegLoading, setFfmpegLoading] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)

  const [error, setError] = useState('')

  const [mediaData, setMediaData] = useState<any>(null)
  const [formats, setFormats] = useState<any[]>([])

  const mediaUrlRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>
  const formatSelectRef = useRef<HTMLSelectElement>(null) as React.RefObject<HTMLSelectElement>
  const mediaTypeRef = useRef<HTMLSelectElement>(null) as React.RefObject<HTMLSelectElement>
  const ffmpegMessageRef = useRef<HTMLParagraphElement>(null) as React.RefObject<HTMLParagraphElement>

  const ffmpegRef = useRef(new FFmpeg())

  const loadFFmpegHandler = async () => {
    setFfmpegLoading(true)
    try {
      await loadFFmpeg(ffmpegRef.current, ffmpegMessageRef)
      setFfmpegLoading(true)
    } catch (err) {
      setError('Failed to load FFmpeg')
    }
    setFfmpegLoading(false)
    setFfmpegLoaded(true)
  }

  const downloadLoadHandler = async () => {
    setDownloadLoading(true)

    try {
      await processDownload(mediaUrlRef, formatSelectRef, mediaTypeRef, ffmpegRef.current)
      setDownloadLoading(false)
    } catch (error) {
      setError('Error downloading media')
    }
    setFetchMediaLoading(false)
  }

  const fetchDetails = async () => {
    if (!mediaUrlRef.current) return

    setFetchMediaLoading(true)
    try {
      const mediaDetails = await fetchMediaDetails(mediaUrlRef.current.value)
      setMediaData(mediaDetails)
      const formats = updateFormatOptions('video', mediaDetails)
      setFormats(formats)
    } catch (error) {
      setError('Error fetching media details!')
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
                error={error}
              />
              <MediaSelect formats={formats} formatSelectRef={formatSelectRef} />
              {ffmpegLoaded ? (
                <DownloadButton
                  downloadMedia={downloadLoadHandler}
                  formatSelectRef={formatSelectRef}
                  loading={downloadLoading}
                />
              ) : (
                <FFmpegLoadingButton load={loadFFmpegHandler} isLoading={ffmpegLoading} />
              )}

              <FFmpegMessage messageRef={ffmpegMessageRef} />
            </div>
          )}
        </section>
      </motion.section>
    </div>
  )
}
