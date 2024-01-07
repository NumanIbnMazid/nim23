import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const API_KEY = process.env.DARKSTAR_GOOGLE_API_KEY
    const channelId = 'UCNNlfUfTU61QaJDWPEakkeg'
    const maxResults = 4; // Adjust as needed

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=${maxResults}`
    )

    if (response.ok) {
      // res.setHeader('Permissions-Policy', 'ch-ua-form-factor');
      // Parse the YouTube videos response
      const data = await response.json()

      // Return the YouTube videos data
      res.status(200).json(data.items)
    } else {
      res.status(response.status).end()
    }
  } catch (error) {
    // console.error('Error fetching YouTube videos:', error)
    res.status(500).end()
  }
}
