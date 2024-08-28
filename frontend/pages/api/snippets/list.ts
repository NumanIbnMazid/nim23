import { NextApiRequest, NextApiResponse } from "next"
import { CODE_SNIPPETS_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract slug and clientID from query parameters
    const { clientID } = _req.query

    // Validate parameters
    if (typeof clientID !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' })
      return
    }

    const response = await fetch(
      CODE_SNIPPETS_ENDPOINT,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          ClientID: clientID,
          "Content-Type": "application/json"
        }
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error fetching Code Snippets: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
