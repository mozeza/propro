import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    const clerkId = session?.userId
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findFirst({ where: { clerkId } })
    if (!user) {
      return NextResponse.json({ trades: [], count: 0 })
    }

    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 200,
    })

    return NextResponse.json({ trades, count: trades.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}