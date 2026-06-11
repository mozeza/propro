import { PlatformAdapter, PlatformCredentials, SyncTrade } from '../types'
export class TradovateAdapter implements PlatformAdapter {
  id = 'tradovate'; name = 'Tradovate'; type = 'sync' as const
  async validateCredentials(creds: PlatformCredentials) {
    if (!creds.username || !creds.password) return { valid: false, error: 'Username and password required' }
    return { valid: true }
  }
  async connect(creds: PlatformCredentials) {
    try {
      const r = await fetch('https://api.tradovate.com/auth/accesstokenrequest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: creds.username, password: creds.password, appId: 'ProPro', appVersion: '1.0', cid: 1, sec: '' })
      })
      return r.status === 200 ? { connected: true, message: 'Connected' } : { connected: false, message: 'Invalid credentials' }
    } catch { return { connected: false, message: 'Connection failed' } }
  }
  async syncTrades(creds: PlatformCredentials, fromDate?: Date): Promise<SyncTrade[]> {
    try {
      const r = await fetch('https://api.tradovate.com/auth/accesstokenrequest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: creds.username, password: creds.password, appId: 'ProPro', appVersion: '1.0', cid: 1, sec: '' })
      })
      const auth = await r.json()
      if (!auth.accessToken) return []
      const fillsR = await fetch('https://live-api.tradovate.com/fill/list?limit=50', {
        headers: { 'Authorization': 'Bearer ' + auth.accessToken }
      })
      const fills = await fillsR.json()
      if (!Array.isArray(fills)) return []
      return fills.slice(0, 50).map((f: any) => ({
        platform: 'tradovate', platformId: 'tradovate',
        instrument: f.contract?.name || f.symbol || 'Unknown',
        direction: f.buySell === 'Buy' ? 'Buy' as const : 'Sell' as const,
        entryPrice: f.price || 0, exitPrice: f.price || 0,
        lots: f.qty || 1, date: new Date(f.fillTime || Date.now()).toISOString().split('T')[0],
        pnl: 0
      }))
    } catch { return [] }
  }
}
