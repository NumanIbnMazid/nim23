import path from 'path'
import { getFileExtension } from '@/lib/utils/file'

export const imageAsBase64 = async (imagePath: string): Promise<string> => {
  if (typeof window !== 'undefined') {
    return '' // 🚫 Prevent running on the client-side
  }

  const fs = await import('fs') // ✅ Dynamic import for server-only execution

  try {
    const absolutePath = path.resolve(imagePath)
    const image = fs.readFileSync(absolutePath)
    return `data:image/png;base64,${image.toString('base64')}`
  } catch (error) {
    console.error('Error converting image to Base64:', error)
    return '' // Return empty string on error
  }
}

export function getCloudinaryFileExtension(file: string): string {
  if (!file) return ''

  // ✅ Handle Cloudinary URLs by extracting the extension from the filename
  const cloudinaryMatch = file.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  if (cloudinaryMatch) {
    return cloudinaryMatch[1].toLowerCase() // ✅ Ensure lowercase
  }

  // ✅ Handle Base64 strings by extracting the MIME type
  const mimeType = file.match(/data:(.*?);/)?.[1]
  const [, fileExtension] = mimeType?.split('/') ?? []
  return fileExtension?.toLowerCase() || ''
}

export const isImageFile = (file: string): boolean => {
  if (!file) return false

  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'avif']
  const fileExtension = getFileExtension(file)

  return imageExtensions.includes(fileExtension)
}
