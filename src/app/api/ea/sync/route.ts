import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EA_API_KEY = 'propro-ea-key-2025'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.apiKey !== EA_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
    }

    const { login, server, broker, accountName, trades, count } = body
    if (!login) return NextResponse.json({ success: false, error: 'login required' }, { status: 400 })

    const fingerprint = `${broker || 'unknown'}|${server || 'unknown'}|${login}`
    const machineId = body.machineId || `ea-${login}`

    let user = await prisma.user.findFirst({ where: { clerkId: fingerprint } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: `ea-${login}@propro.app`, clerkId: fingerprint, name: `${broker || 'EA'} #${login}` }
      })
    }
    // Check if this login is linked to a Clerk user via platform connection
    const linkedConnections = await prisma.platformConnection.findMany({
      where: { platformId: 'mt4', metadata: { contains: `"login":"${login}"` } }
    })
    if (linkedConnections.length > 0) {
      // Found a user who linked this account - save trades under their ID
      const linkedUserId = linkedConnections[0].userId
      // Transfer EA user's trades to the linked user
      await prisma.trade.updateMany({ where: { userId: user.id }, data: { userId: linkedUserId } })
      user = await prisma.user.findUnique({ where: { id: linkedUserId } }) || user
    }

    await prisma.platformConnection.upsert({
      where: { userId_platformId: { userId: user.id, platformId: 'mt4' } },
      update: { status: 'connected', lastSyncAt: new Date(), metadata: JSON.stringify({ server, broker, login, machineId }) },
      create: { userId: user.id, platformId: 'mt4', platformName: `${broker || 'MT4'} #${login}`, status: 'connected', metadata: JSON.stringify({ server, broker, login, machineId }) },
    })

    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      let serverInfo = null
      try {
        const dns = await import('dns').then(m => m.promises)
        const addrs = await dns.resolve4(server || '')
        serverInfo = { host: server, ip: addrs[0] || null }
      } catch {}
      return NextResponse.json({
        success: true,
        message: `${broker} #${login}: connected`,
        count: 0,
        userId: user.id,
        identity: { fingerprint, userId: user.id },
        serverResolved: serverInfo,
      })
    }

    let saved = 0
    for (const t of trades) {
      try {
        if (t.ticket) {
          const existing = await prisma.trade.findFirst({
            where: { userId: user.id, notes: { contains: `ticket #${t.ticket}` } }
          })
          if (existing) continue
        }
        await prisma.trade.create({
          data: {
            userId: user.id,
            instrument: t.instrument || t.symbol || 'Unknown',
            direction: (t.direction === 'Buy') ? 'Buy' : 'Sell',
            entryPrice: t.entryPrice || t.price || t.openPrice || 0,
            exitPrice: t.exitPrice || t.price || t.closePrice || 0,
            lots: t.lots || t.volume || 0.01,
            date: new Date(),
            pnl: t.profit || 0,
            commission: t.commission || 0,
            platform: 'mt4',
            notes: `${broker || 'EA'} ticket #${t.ticket || ''}`,
          }
        })
        saved++
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `${broker} #${login}: saved ${saved}/${trades.length}`,
      count: saved, userId: user.id,
      identity: { fingerprint, userId: user.id },
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'EA sync failed' }, { status: 500 })
  }
}
