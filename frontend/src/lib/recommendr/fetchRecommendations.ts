export async function getRecommendations(preferences: any, clientID: string | null) {
  if (!clientID) {
    throw new Error('Client ID is required')
  }

  const apiURL = `${process.env.BACKEND_API_BASE_URL}/recommendr/recommend/`
  // Enforcing the expected request structure
  const body = {
    client_id: clientID,
    media_type: preferences.media_type,
    mood: preferences.mood,
    occasion: preferences.occasion || [],
    genres: preferences.genres || [],
    language: preferences.language || [],
    media_age: preferences.media_age || [],
    rating: preferences.rating?.length ? preferences.rating : [''],
    categories: preferences.categories?.length ? preferences.categories : [''],
    other_preferences: preferences.other_preferences || '',
  }

  const res = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch recommendations!')
  }

  return data?.data?.recommendations || []
}
