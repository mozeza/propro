import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'email query parameter is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, image, password, clerkId, tradingStyle, experienceYears, preferredMarkets, referralSource } = body

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
        ...(password !== undefined && { password }),
        ...(clerkId !== undefined && { clerkId }),
        ...(tradingStyle !== undefined && { tradingStyle }),
        ...(experienceYears !== undefined && { experienceYears }),
        ...(preferredMarkets !== undefined && { preferredMarkets }),
        ...(referralSource !== undefined && { referralSource }),
      },
      create: {
        email,
        name: name || null,
        image: image || null,
        password: password || null,
        clerkId: clerkId || null,
        tradingStyle: tradingStyle || null,
        experienceYears: experienceYears || null,
        preferredMarkets: preferredMarkets || null,
        referralSource: referralSource || null,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json(
      { error: 'Failed to create or update user' },
      { status: 500 }
    )
  }
}
