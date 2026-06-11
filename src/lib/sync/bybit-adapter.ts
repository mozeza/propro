export interface TradeResult {
  platformId: string
  instrument: string
  direction: 'Buy' | 'Sell'
  entryPrice: number
  exitPrice: number
  lots: number
  date: string
  pnl: number
  commission: number
}

export interface SyncResponse {
  success: boolean
  message: string
  trades: TradeResult[]
  count: number
  saved?: number
}

export async function syncByBitOrders(apiKey: string, daysBack: number = 30): Promise<SyncResponse> {
  try {
    const now = Date.now()
    const from = now - (daysBack * 86400000)
    const response = await fetch(
      'https://api.bybit.com/v5/order/history?category=spot&limit=50&startTime=' + from + '&endTime=' + now,
      {
        headers: {
          'X-BAPI-API-KEY': apiKey,
          'X-BAPI-TIMESTAMP': String(now),
        }
      }
    )
    if (!response.ok) {
      const text = await response.text()
      return { success: false, message: 'ByBit API Error: ' + response.status + ' ' + text, trades: [], count: 0 }
    }
    const data = await response.json()
    if (data.retCode !== 0) {
      return { success: false, message: 'ByBit retCode: ' + data.retCode + ' - ' + (data.retMsg || 'Unknown'), trades: [], count: 0 }
    }
    const orders = data.result?.list || []
    const filledOrders = orders.filter((o: any) => o.orderStatus === 'Filled')
    if (filledOrders.length === 0) {
      return { success: true, message: 'Connected! No filled orders found.', trades: [], count: 0 }
    }
    const trades: TradeResult[] = filledOrders.map((o: any) => ({
      platformId: 'bybit',
      instrument: o.symbol,
      direction: o.side === 'Buy' ? 'Buy' as const : 'Sell' as const,
      entryPrice: parseFloat(o.price) || 0,
      exitPrice: parseFloat(o.avgPrice) || parseFloat(o.price) || 0,
      lots: parseFloat(o.qty) || 1,
      date: new Date(parseInt(o.createdTime)).toISOString().split('T')[0],
      pnl: parseFloat(o.closedPnl || '0'),
      commission: parseFloat(o.cumFee || '0'),
    }))
    return { success: true, message: 'Pulled ' + filledOrders.length + ' trades from ByBit', trades, count: trades.length }
  } catch (e: any) {
    return { success: false, message: 'ByBit Error: ' + (e.message || String(e)), trades: [], count: 0 }
  }
}
