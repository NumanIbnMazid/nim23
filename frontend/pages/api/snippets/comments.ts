import { NextApiRequest, NextApiResponse } from "next"
import { SNIPPET_COMMENT_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, email, comment, slug, method } = _req.query

    // Validate parameters
    if (typeof name !== 'string' || typeof email !== 'string' || typeof comment !== 'string' || typeof slug !== 'string' || typeof method !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' })
      return
    }

    const response = await fetch(
      SNIPPET_COMMENT_ENDPOINT + `?slug=${slug}`,
      {
        method: method,
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: method == "POST" ? JSON.stringify({ name, email, comment }) : null
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const messageText = method == "POST" ? "Error posting snippet comment" : "Error fetching snippet comments"
      const errorMessage = `${messageText}: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
