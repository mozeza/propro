import { PlatformAdapter, PlatformCredentials, SyncTrade } from '../types'
export class CoinbaseAdapter implements PlatformAdapter {
  id = 'coinbase'; name = 'Coinbase'; type = 'sync' as const
  async validateCredentials(creds: PlatformCredentials) {
    if (!creds.apiKey || !creds.apiSecret) return { valid: false, error: 'API Key Name and Private Key required' }
    return { valid: true }
  }
  async connect(creds: PlatformCredentials) {
    try {
      const ts = Math.floor(Date.now() / 1000)
      const r = await fetch('https://api.coinbase.com/v2/user', {
        headers: { 'CB-ACCESS-KEY': creds.apiKey!, 'CB-ACCESS-TIMESTAMP': String(ts) }
      })
      return r.status === 200 ? { connected: true, message: 'Connected' } : { connected: false, message: 'Invalid credentials' }
    } catch { return { connected: false, message: 'Connection failed' } }
  }
  async syncTrades(creds: PlatformCredentials, fromDate?: Date): Promise<SyncTrade[]> {
    try {
      const start = fromDate ? fromDate.toISOString() : new Date(Date.now() - 30*86400000).toISOString()
      const r = await fetch(`https://api.coinbase.com/api/v3/brokerage/orders/history?start_date=${start}&limit=50&order_status=FILLED`, {
        headers: { 'CB-ACCESS-KEY': creds.apiKey!, 'CB-ACCESS-TIMESTAMP': String(Math.floor(Date.now() / 1000)) }
      })
      const data = await r.json()
      if (!data.orders?.length) return []
      return data.orders.map((o: any) => ({
        platform: 'coinbase', platformId: 'coinbase', instrument: o.product_id,
        direction: o.side === 'BUY' ? 'Buy' as const : 'Sell' as const,
        entryPrice: parseFloat(o.filled_price) || 0, exitPrice: parseFloat(o.average_filled_price) || parseFloat(o.filled_price) || 0,
        lots: parseFloat(o.filled_size) || 1, date: (o.created_time || '').split('T')[0],
        pnl: -(parseFloat(o.commission || '0')), commission: parseFloat(o.commission || '0'),
      }))
    } catch { return [] }
  }
}
