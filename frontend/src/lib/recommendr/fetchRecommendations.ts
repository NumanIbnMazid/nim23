export async function getRecommendations(preferences: any) {
  const apiURL = `${process.env.BACKEND_API_BASE_URL}/recommendr/recommend/`
  console.log(`Fetching recommendations from ${apiURL} with preferences:`, preferences)

  // Enforcing the expected request structure
  const body = {
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
