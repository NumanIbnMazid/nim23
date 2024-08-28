import { NextApiRequest, NextApiResponse } from "next"
import { NEWSLETTER_SUBSCRIPTION_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract slug and clientID from query parameters
    const { email } = _req.query

    // Validate parameters
    if (typeof email !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' })
      return
    }

    const response = await fetch(
      NEWSLETTER_SUBSCRIPTION_ENDPOINT,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error while subscribing newsletter: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
