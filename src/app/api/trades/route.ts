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

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(trades)
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, instrument, direction, entryPrice, exitPrice, lots, date, notes, platform } = body

    if (!userId || !instrument || !direction || entryPrice === undefined || exitPrice === undefined || lots === undefined || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, instrument, direction, entryPrice, exitPrice, lots, date' },
        { status: 400 }
      )
    }

    const pnl = (exitPrice - entryPrice) * lots

    const trade = await prisma.trade.create({
      data: {
        userId,
        instrument,
        direction,
        entryPrice,
        exitPrice,
        lots,
        date: new Date(date),
        notes: notes || null,
        platform: platform || null,
        pnl,
      },
    })

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}
