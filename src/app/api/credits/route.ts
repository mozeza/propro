import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        totalCredits: true,
        lifetimeCredits: true,
        creditTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      balance: user.totalCredits,
      lifetimeCredits: user.lifetimeCredits,
      transactions: user.creditTransactions,
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, type, description } = body

    if (!userId || amount === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, type' },
        { status: 400 }
      )
    }

    const validTypes = ['purchase_reward', 'challenge_purchase', 'referral_bonus', 'giveaway_win', 'admin']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (amount < 0 && user.totalCredits + amount < 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    const [transaction] = await prisma.$transaction([
      prisma.creditTransaction.create({
        data: {
          userId,
          amount,
          type,
          description: description || null,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalCredits: { increment: amount },
          ...(amount > 0 ? { lifetimeCredits: { increment: amount } } : {}),
        },
      }),
    ])

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error processing credit transaction:', error)
    return NextResponse.json(
      { error: 'Failed to process credit transaction' },
      { status: 500 }
    )
  }
}
