import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUUIDSlug } from '@/lib/utils/helpers'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // ✅ Check if email is already subscribed
    const existingSubscription = await prisma.newsletter_subscription.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 })
    }

    // ✅ Create a new subscription
    const newSubscription = await prisma.newsletter_subscription.create({
      data: {
        email,
        slug: generateUUIDSlug(),
        created_at: new Date(),
      },
    })

    // ✅ Convert BigInt fields to string before returning response
    return NextResponse.json(
      {
        message: 'Subscription successful! 🎉',
        subscription: {
          ...newSubscription,
          id: newSubscription.id.toString(), // ✅ Convert BigInt to string
          created_at: newSubscription.created_at.toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
