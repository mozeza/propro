// ─── MT4/MT5 DIRECT TCP CONNECTION ─────────────────────
// חיבור ישיר לשרת MT4/5 דרך Investor Password (Manager API Protocol)
// פרוטוקול: TCP Binary, פורט 443 (Manager API)
//
// MetaTrader Manager API Packet Structure:
// [BodyLen:4] [Cmd:4] [Data:BodyLen-4]

import type { MT4Trade } from './mt4-sync-server'

export interface MT4SyncResult {
  success: boolean
  message: string
  trades: MT4Trade[]
  count: number
}

// ─── MT4 Manager API Commands ──────────────────────────
const CMD = {
  LOGIN: 0,
  LOGIN_RESP: 1,
  USERS_ONLINE: 18,
  USER_TRADE_HISTORY: 31,
  USER_TRADE_HISTORY_RESP: 32,
  USER_ORDERS: 33,
  USER_ORDERS_RESP: 34,
  PING: 128,
  PONG: 129,
}

// ─── TCP CONNECTION ────────────────────────────────────
// שולח פקטת TCP לשרת ה-MT4/5, מזדהה עם Investor Password
// ומקבל היסטוריית מסחר מלאה

export async function connectMT4(
  server: string,
  port: number,
  login: number,
  investorPassword: string
): Promise<MT4SyncResult> {
  const { connectMT4viaTCP } = await import('./mt4-sync-server')
  return connectMT4viaTCP(server, port, login, investorPassword)
}

// ─── INVESTOR PASSWORD FORMAT ──────────────────────────
// MT4/5 מאחסן את ה-Investor Password כ-MD5 Hash
// החיבור לשרת דורש לשלוח:
// 1. Login number (int32)
// 2. Password hash (MD5, 16 bytes)
// 3. Connection type (Investor = 4)

export function hashInvestorPassword(password: string): string {
  // In reality this is MD5(password)
  // We'll use crypto-js or built-in crypto
  let hash = ''
  // Simple implementation for now
  for (let i = 0; i < password.length; i++) {
    hash += String.fromCharCode((password.charCodeAt(i) + 7) % 256)
  }
  return hash
}

// ─── CSV FALLBACK ──────────────────────────────────────
// תמיד יש CSV כ-backup
export function parseMT4CSV(csvText: string): MT4Trade[] {
  const lines = csvText.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase())
  const trades: MT4Trade[] = []

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i])
    if (vals.length < 5) continue
    
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] || '' })

    const type = (row['type'] || row['direction'] || '').toLowerCase()
    if (type.includes('balance') || type.includes('withdrawal') || type.includes('deposit')) continue
    
    const direction = type.includes('sell') ? 'Sell' as const : 'Buy' as const
    const timeStr = row['time'] || ''
    const dateStr = timeStr.includes('.') ? timeStr.split(' ')[0]?.replace(/\./g, '-') : 
                    timeStr.includes('-') ? timeStr.split(' ')[0] : new Date().toISOString().split('T')[0]
    const timeOnly = timeStr.includes(' ') ? timeStr.split(' ')[1]?.slice(0, 8) || '' : ''

    trades.push({
      platformId: 'mt4',
      instrument: row['symbol'] || row['symb'] || 'Unknown',
      direction,
      entryPrice: parseFloat(row['open price'] || row['open_price'] || row['price'] || '0'),
      exitPrice: parseFloat(row['close price'] || row['close_price'] || '0'),
      lots: parseFloat(row['size'] || row['volume'] || '0.01'),
      date: dateStr,
      time: timeOnly,
      pnl: parseFloat(row['profit'] || '0'),
      commission: parseFloat(row['commission'] || '0'),
      swap: parseFloat(row['swap'] || '0'),
      ticket: parseInt(row['order'] || row['deal'] || '0'),
      openTime: 0,
      closeTime: 0,
      comment: row['comment'] || '',
      login: parseInt(row['login'] || '0'),
    })
  }
  return trades
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') { inQuotes = !inQuotes }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += char }
  }
  result.push(current.trim())
  return result
}

export async function syncMT4viaCSV(csvText: string): Promise<MT4SyncResult> {
  try {
    const trades = parseMT4CSV(csvText)
    if (trades.length === 0) return { success: false, message: 'No trades found. Export from History as Detailed Report.', trades: [], count: 0 }
    return { success: true, message: `Parsed ${trades.length} trades`, trades, count: trades.length }
  } catch (e: any) {
    return { success: false, message: 'Parse error: ' + (e.message || String(e)), trades: [], count: 0 }
  }
}
