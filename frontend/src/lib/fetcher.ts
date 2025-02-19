/**
 * Makes a request to the specified URL and returns the response as JSON.
 */
const fetcher = async (url: string) => {
  if (typeof window === 'undefined') return null // ✅ Prevent fetching on the server
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export default fetcher
