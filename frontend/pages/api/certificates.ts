import { NextApiRequest, NextApiResponse } from "next"
import { CERTIFICATES_ENDPOINT, BACKEND_API_TOKEN } from '@lib/backendAPI'


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      CERTIFICATES_ENDPOINT,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${BACKEND_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      res.status(200).json(responseData.data)
    } else {
      const errorMessage = `Error fetching Certificates: ${response.status} ${response.statusText}`
      console.log(errorMessage)
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error);
    res.status(500).end()
  }
}
