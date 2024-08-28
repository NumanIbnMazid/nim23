import { NextApiRequest, NextApiResponse } from "next"
import { BLOG_VIEWS_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract slug and clientID from query parameters
    const { slug, clientID } = _req.query

    // Validate parameters
    if (typeof slug !== 'string' || typeof clientID !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' })
      return
    }

    const response = await fetch(
      BLOG_VIEWS_ENDPOINT + `?slug=${slug}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ clientID })
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error fetching Blog Views: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
