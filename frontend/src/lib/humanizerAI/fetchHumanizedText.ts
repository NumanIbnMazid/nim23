export async function fetchHumanizedText(inputText: string): Promise<string> {
  const apiURL = `${process.env.BACKEND_API_BASE_URL}/humanizer-ai/humanize/`
  const res = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input_text: inputText }),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to humanize text.')
  }

  return data.data.humanized_text
}
