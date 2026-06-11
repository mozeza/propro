import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// EA checks this endpoint every 60 seconds
// Returns: { syncRequested: true/false, login, server, broker }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const login = searchParams.get('login')
    const server = searchParams.get('server')

    if (!login) {
      return NextResponse.json({ syncRequested: false })
    }

    // Find platform connection for this login
    const connections = await prisma.platformConnection.findMany({
      where: { platformId: 'mt4' },
    })

    for (const conn of connections) {
      try {
        const meta = JSON.parse(conn.metadata || '{}')
        const metaLogin = String(meta.login || '')
        const reqLogin = String(login)
        if (metaLogin === reqLogin && meta.syncRequested) {
          // Clear the flag so it doesn't re-trigger
          await prisma.platformConnection.update({
            where: { id: conn.id },
            data: {
              metadata: JSON.stringify({
                ...meta,
                syncRequested: false,
                lastSyncAt: new Date().toISOString(),
              }),
            },
          })
          return NextResponse.json({
            syncRequested: true,
            login: meta.login,
            server: meta.server,
            broker: meta.broker,
          })
        }
      } catch {}
    }

    return NextResponse.json({ syncRequested: false })
  } catch {
    return NextResponse.json({ syncRequested: false })
  }
}
