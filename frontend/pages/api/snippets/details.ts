import { NextApiRequest, NextApiResponse } from "next"
import { CODE_SNIPPETS_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


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
      CODE_SNIPPETS_ENDPOINT + slug,
      {
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          ClientID: clientID
        }
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error fetching Code Snippet Details: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
