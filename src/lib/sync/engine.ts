import { PlatformCredentials, SyncResult, PlatformAdapter } from './types'
import { ByBitAdapter } from './adapters/bybit'
import { TradovateAdapter } from './adapters/tradovate'
import { CoinbaseAdapter } from './adapters/coinbase'

const adapters: Map<string, PlatformAdapter> = new Map()
function reg(a: PlatformAdapter) { adapters.set(a.id, a) }
reg(new ByBitAdapter())
reg(new TradovateAdapter())
reg(new CoinbaseAdapter())

export function getAdapter(id: string) { return adapters.get(id) }
export function listAdapters() { return Array.from(adapters.values()).map(a => ({ id: a.id, name: a.name, type: a.type })) }

export async function validatePlatformCredentials(id: string, creds: PlatformCredentials) {
  const a = getAdapter(id)
  return a ? a.validateCredentials(creds) : { valid: false, error: 'Platform not supported' }
}

export async function connectToPlatform(id: string, creds: PlatformCredentials) {
  const a = getAdapter(id)
  return a ? a.connect(creds) : { connected: false, message: 'Platform not supported' }
}

export async function syncPlatformTrades(platformId: string, creds: PlatformCredentials, userId: string, fromDate?: Date): Promise<SyncResult> {
  const a = getAdapter(platformId)
  if (!a) return { success: false, platform: platformId, tradesImported: 0, errors: ['Platform not supported'], syncDate: new Date().toISOString() }
  try {
    const trades = await a.syncTrades(creds, fromDate)
    let saved = 0
    for (const t of trades) {
      try {
        await fetch('/api/trades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...t, userId }) })
        saved++
      } catch {}
    }
    return { success: true, platform: platformId, tradesImported: saved, syncDate: new Date().toISOString(), fromDate: fromDate?.toISOString() }
  } catch (e: any) {
    return { success: false, platform: platformId, tradesImported: 0, errors: [e.message || 'Sync failed'], syncDate: new Date().toISOString() }
  }
}
