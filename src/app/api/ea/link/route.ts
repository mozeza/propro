import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Link EA fingerprint to Clerk user
// When user connects MT4 from Journal, we map:
//   fingerprint = "broker|server|login"  →  clerkUserId

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, login, server, broker } = body

    if (!userId || !login) {
      return NextResponse.json({ error: 'userId and login required' }, { status: 400 })
    }

    const fingerprint = `${broker || 'unknown'}|${server || 'unknown'}|${login}`

    // Find the EA-created user by fingerprint
    const eaUser = await prisma.user.findFirst({ where: { clerkId: fingerprint } })

    if (eaUser) {
      // Link: update EA user's trades to the Clerk user
      // Transfer trade ownership
      await prisma.trade.updateMany({
        where: { userId: eaUser.id },
        data: { userId: userId },
      })

      // Delete the EA user
      await prisma.platformConnection.deleteMany({ where: { userId: eaUser.id } })
      await prisma.user.delete({ where: { id: eaUser.id } })
    }

    // Save connection for the Clerk user
    await prisma.platformConnection.upsert({
      where: { userId_platformId: { userId, platformId: 'mt4' } },
      update: {
        status: 'connected',
        lastSyncAt: new Date(),
        metadata: JSON.stringify({
          server, broker, login,
          fingerprint: fingerprint,
          source: 'ea',
        }),
      },
      create: {
        userId,
        platformId: 'mt4',
        platformName: `${broker || 'MT4'} #${login}`,
        status: 'connected',
        metadata: JSON.stringify({ server, broker, login, fingerprint, source: 'ea' }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Linked EA account ${broker} #${login} to your ProPro account`,
      fingerprint,
      userId,
      tradesTransferred: eaUser ? 'yes' : 'n/a',
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Link failed' }, { status: 500 })
  }
}
