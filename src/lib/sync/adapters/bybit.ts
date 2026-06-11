import { PlatformAdapter, PlatformCredentials, SyncTrade } from '../types'
export class ByBitAdapter implements PlatformAdapter {
  id = 'bybit'; name = 'ByBit'; type = 'sync' as const
  async validateCredentials(creds: PlatformCredentials) {
    if (!creds.apiKey || !creds.apiSecret) return { valid: false, error: 'API Key and Secret required' }
    return { valid: true }
  }
  async connect(creds: PlatformCredentials) {
    try {
      const r = await fetch('https://api.bybit.com/v5/account/wallet-balance', {
        headers: { 'X-BAPI-API-KEY': creds.apiKey!, 'X-BAPI-TIMESTAMP': String(Date.now()) }
      })
      return r.status === 200 ? { connected: true, message: 'Connected' } : { connected: false, message: 'Invalid credentials' }
    } catch { return { connected: false, message: 'Connection failed' } }
  }
  async syncTrades(creds: PlatformCredentials, fromDate?: Date): Promise<SyncTrade[]> {
    try {
      const endTime = Date.now()
      const startTime = fromDate ? fromDate.getTime() : endTime - 30*86400000
      const r = await fetch(`https://api.bybit.com/v5/order/history?category=spot&limit=50&startTime=${startTime}&endTime=${endTime}`, {
        headers: { 'X-BAPI-API-KEY': creds.apiKey!, 'X-BAPI-TIMESTAMP': String(endTime) }
      })
      const data = await r.json()
      if (!data.result?.list) return []
      return data.result.list.filter((o: any) => o.orderStatus === 'Filled').map((o: any) => ({
        platform: 'bybit', platformId: 'bybit', instrument: o.symbol,
        direction: o.side === 'Buy' ? 'Buy' as const : 'Sell' as const,
        entryPrice: parseFloat(o.price) || 0, exitPrice: parseFloat(o.avgPrice) || parseFloat(o.price) || 0,
        lots: parseFloat(o.qty) || 1, date: new Date(parseInt(o.createdTime)).toISOString().split('T')[0],
        pnl: parseFloat(o.closedPnl || '0'), commission: parseFloat(o.cumFee || '0'),
      }))
    } catch { return [] }
  }
}
