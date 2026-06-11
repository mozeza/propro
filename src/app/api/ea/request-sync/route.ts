import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, login, server, broker } = body
    if (!userId || !login) {
      return NextResponse.json({ error: 'userId and login required' }, { status: 400 })
    }

    const fingerprint = `${broker || 'unknown'}|${server || 'unknown'}|${login}`

    await prisma.platformConnection.upsert({
      where: { userId_platformId: { userId, platformId: 'mt4' } },
      update: {
        metadata: JSON.stringify({
          server, broker, login, fingerprint,
          syncRequested: true,
          syncRequestedAt: new Date().toISOString(),
        }),
      },
      create: {
        userId, platformId: 'mt4',
        platformName: `${broker || 'MT4'} #${login}`,
        status: 'connected',
        metadata: JSON.stringify({
          server, broker, login, fingerprint,
          syncRequested: true,
          syncRequestedAt: new Date().toISOString(),
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Sync requested for ${broker} #${login}. EA will sync within 60 seconds.`,
      fingerprint,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
