export function getFileExtension(file: string): string {
  if (!file) return ''

  // ✅ Detect Cloudinary URLs and extract extension
  const cloudinaryMatch = file.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  if (cloudinaryMatch) {
    return cloudinaryMatch[1].toLowerCase() // ✅ Ensure lowercase
  }

  // ✅ Detect Base64 MIME type
  const base64Match = file.match(/^data:image\/([a-zA-Z0-9]+);base64,/)
  if (base64Match) {
    return base64Match[1].toLowerCase()
  }

  return ''
}
