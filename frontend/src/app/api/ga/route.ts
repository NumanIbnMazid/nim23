import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GA_PROPERTY_ID
const DAYS = 28

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/gm, '\n'), // ✅ Fix private key formatting
  },
  projectId: process.env.GA_PROJECT_ID,
})

export async function GET() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'year' }],
      metrics: [{ name: 'activeUsers' }],
    })

    let totalVisitors = 0
    response.rows?.forEach((row) => {
      if (row.metricValues && row.metricValues[0].value) {
        totalVisitors += parseInt(row.metricValues[0].value as string)
      }
    })

    return NextResponse.json(
      { totalVisitors, days: DAYS },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=21600',
        },
      }
    )
  } catch (error) {
    console.error('❌ Error fetching GA Data:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
