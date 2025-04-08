import { PUBLIC_SITE_URL } from '@/lib/constants'

export const fetchMediaDetails = async (url: string, setStatusMessage: any) => {
  const apiUrl = `${PUBLIC_SITE_URL}/api/grabit/media-details`
  const response = await fetch(`${apiUrl}?media_url=${encodeURIComponent(url)}`)

  if (!response.ok) {
    let errorMsg = `Failed to fetch media details (HTTP ${response.status})`
    try {
      const errorData = await response.json()
      errorMsg = errorData.message || errorMsg
    } catch (e) {
      // ignore JSON parse errors
      errorMsg = `Failed to fetch media details! (${e})`
    }
    throw new Error(errorMsg)
  }

  const result = await response.json()
  setStatusMessage('Please choose your desired media to download.....')
  return result.success ? result.data.media_info : null
}
