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

  formats = formats.filter(Boolean) // Remove null/undefined values
  return formats
}
