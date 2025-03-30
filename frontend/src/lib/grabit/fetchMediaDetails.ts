import { PUBLIC_SITE_URL } from '@/lib/constants'

export const fetchMediaDetails = async (url: string) => {
  const apiUrl = `${PUBLIC_SITE_URL}/api/grabit/media-details`
  console.log('Fetching media details from (route.ts):', apiUrl);
  
  try {
    const response = await fetch(`${apiUrl}?media_url=${encodeURIComponent(url)}`)
    const result = await response.json()
    console.log('Response (route.ts):', result);
    
    return result.success ? result.data.media_info : null
  } catch (error) {
    throw new Error('Failed to fetch media details: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}
