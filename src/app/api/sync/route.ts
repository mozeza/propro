import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platformId, credentials } = body

    if (!platformId || !credentials) {
      return NextResponse.json({ error: 'Missing platformId or credentials' }, { status: 400 })
    }

    let result

    switch (platformId) {
      case 'mt4':
      case 'mt5': {
        if (credentials.csv) {
          const { syncMT4viaCSV } = await import('@/lib/sync/mt4-adapter')
          result = await syncMT4viaCSV(credentials.csv)
        } else if (credentials.login && credentials.investorPassword) {
          // Forward to MT4 Bridge Service (TCP connection)
          const bridgeUrl = process.env.MT4_BRIDGE_URL || 'http://localhost:3001'
          const bridgeKey = process.env.MT4_BRIDGE_KEY || 'propro-bridge-key-2025'
          
          let server = credentials.server || ''
          let port = 443
          
          // Check common servers
          const COMMON_SERVERS: Record<string, string> = {
            'roboforex': 'mt5.roboforex.com:443',
            'ftmo': 'mt4.ftmo.com:443',
            'fundingpips': 'mt4.fundingpips.com:443',
            'fundednext': 'mt4.fundednext.com:443',
            'apex': 'mt4.apextraderfunding.com:443',
            'blueguardian': 'mt4.blueguardian.com:443',
            'the5ers': 'mt4.the5ers.com:443',
            'icmarkets': 'mt4.icmarkets.com:443',
            'pepperstone': 'mt4.pepperstone.com:443',
            'fpmarkets': 'mt4.fpmarkets.com:443',
            'exness': 'mt4.exness.com:443',
          }
          
          if (server && COMMON_SERVERS[server.toLowerCase()]) {
            server = COMMON_SERVERS[server.toLowerCase()]
          }
          
          if (server.includes(':')) {
            const parts = server.split(':')
            server = parts[0]
            port = parseInt(parts[1]) || 443
          }
          
          if (!server) {
            return NextResponse.json({ 
              error: 'Server address required. Select a broker from the list.',
              brokers: Object.keys(COMMON_SERVERS)
            }, { status: 400 })
          }
          
          try {
            const bridgeResp = await fetch(`${bridgeUrl}/api/sync/mt4`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                server,
                port,
                login: parseInt(credentials.login),
                password: credentials.investorPassword,
                apiKey: bridgeKey,
              })
            })
            
            const bridgeData = await bridgeResp.json()
            result = {
              success: bridgeData.success,
              message: bridgeData.message,
              count: bridgeData.count || 0,
              trades: bridgeData.trades || [],
            }
          } catch (e: any) {
            return NextResponse.json({ 
              error: `MT4 Bridge unavailable. Make sure the bridge service is running. (${e.message || 'Connection refused'})` 
            }, { status: 503 })
          }
        } else {
          return NextResponse.json({ error: 'MT4/MT5 requires Server, Login Number, and Investor Password' }, { status: 400 })
        }
        break
      }
      case 'bybit': {
        const { syncByBitOrders } = await import('@/lib/sync/bybit-adapter')
        result = await syncByBitOrders(credentials.apiKey || '', credentials.daysBack ? parseInt(credentials.daysBack) : 30)
        break
      }
      case 'tradovate': {
        const { TradovateAdapter } = await import('@/lib/sync/adapters/tradovate')
        const adapter = new TradovateAdapter()
        const creds = { username: credentials.username || '', password: credentials.password || '' }
        const connectResult = await adapter.connect(creds)
        if (!connectResult.connected) {
          return NextResponse.json({ success: false, message: connectResult.message || 'Connection failed', trades: [], count: 0 })
        }
        const trades = await adapter.syncTrades(creds)
        result = { success: true, message: 'Pulled ' + trades.length + ' trades from Tradovate', trades, count: trades.length }
        break
      }
      default:
        return NextResponse.json({ error: 'Platform ' + platformId + ' not supported yet. Use CSV upload.' }, { status: 400 })
    }

    // Save trades to database if we got a userId
    let saved = 0
    if (result.trades?.length > 0 && body.userId) {
      const { prisma } = await import('@/lib/prisma')
      for (const t of result.trades) {
        try {
          await prisma.trade.create({
            data: {
              userId: body.userId,
              instrument: t.instrument,
              direction: t.direction,
              entryPrice: t.entryPrice,
              exitPrice: t.exitPrice,
              lots: t.lots,
              date: t.date ? new Date(t.date) : new Date(),
              pnl: t.pnl,
              commission: t.commission || 0,
              platform: body.platformId,
            }
          })
          saved++
        } catch (e) { /* skip duplicate */ }
      }
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      count: result.count,
      tradesCount: 0,
      saved: saved
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Sync failed: ' + (e.message || String(e)) }, { status: 500 })
  }
}
