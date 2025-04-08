export const updateFormatOptions = (
  type: string,
  mediaData: any,
) => {
  let formats: any[] = []
  if (type === 'video') {
    formats.push(mediaData.formats_filtered.best_video)
    formats = formats.concat(mediaData.formats_filtered.video_formats)
  } else if (type === 'audio') {
    formats.push(mediaData.formats_filtered.best_audio)
    formats = formats.concat(mediaData.formats_filtered.audio_formats)
  }

  // filter formats where quality is null and where format, quality and size is same to remove duplicates
  formats = formats.filter((format, index, self) => {
    const isDuplicate = self.findIndex(f => f.format === format.format && f.quality === format.quality && f.filesize === format.filesize) !== index
    return !isDuplicate && format.quality !== null
  })
  // filter formats where quality is null
  formats = formats.filter(format => format.quality !== null)

  formats = formats.filter(Boolean) // Remove null/undefined values
  return formats
}
