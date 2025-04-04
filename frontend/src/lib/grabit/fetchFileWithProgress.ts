export const fetchFileWithProgress = async (
  url: string,
  onProgress: (percent: number, downloadedSize: string, totalSize: string) => void
): Promise<Uint8Array> => {
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10)
  const totalSizeFormatted = contentLength > 0 ? formatBytes(contentLength) : 'Unknown size'

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []

  let receivedLength = 0
  let result = await reader.read()

  while (!result.done) {
    const { value } = result
    if (value) {
      chunks.push(value)
      receivedLength += value.length

      const downloadedSizeFormatted = formatBytes(receivedLength)
      if (contentLength > 0) {
        onProgress(receivedLength / contentLength, downloadedSizeFormatted, totalSizeFormatted)
      }
    }
    result = await reader.read()
  }

  const fullArray = new Uint8Array(receivedLength)
  let position = 0
  for (const chunk of chunks) {
    fullArray.set(chunk, position)
    position += chunk.length
  }

  return fullArray
}

// Helper function to format bytes into KB, MB, GB
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
