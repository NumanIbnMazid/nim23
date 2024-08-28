import { NextApiRequest, NextApiResponse } from "next"
import { EXPERIENCE_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { limit } = _req.query

    // Validate parameters
    if (typeof limit !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' })
      return
    }

    const length = limit
    let ENDPOINT = null
    
    // Set limit if length is not undefined
    if (length !== null) {
      ENDPOINT = EXPERIENCE_ENDPOINT + `?_limit=${length}`
    }
    else {
      ENDPOINT = EXPERIENCE_ENDPOINT
    }

    const response = await fetch(
      ENDPOINT,
      {
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`
        }
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error fetching Experiences: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
