export async function getPreferences() {
  const apiURL = `${process.env.BACKEND_API_BASE_URL}/recommendr/preferences/`
  const res = await fetch(apiURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch preferences!')
  }

  return data.data
}
