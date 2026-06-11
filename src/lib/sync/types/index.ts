export interface SyncTrade {
  id?: string
  userId?: string
  platform: string
  platformId: string
  instrument: string
  direction: 'Buy' | 'Sell'
  entryPrice: number
  exitPrice: number
  lots: number
  date: string
  time?: string
  pnl: number
  commission?: number
  fees?: number
  netPnl?: number
  notes?: string
}

export interface PlatformCredentials {
  username?: string
  password?: string
  apiKey?: string
  apiSecret?: string
  token?: string
  refreshToken?: string
  serverUrl?: string
  accountId?: string
  flexToken?: string
  flexQueryId?: string
  login?: string
  investorPassword?: string
}

export interface PlatformConnection {
  userId: string
  platformId: string
  platformName: string
  credentials: PlatformCredentials
  settings?: { syncFromDate?: string; autoSync?: boolean }
}

export interface SyncResult {
  success: boolean
  platform: string
  tradesImported: number
  errors?: string[]
  syncDate: string
  fromDate?: string
}

export interface PlatformAdapter {
  id: string
  name: string
  type: 'sync' | 'file' | 'coming-soon'
  validateCredentials(creds: PlatformCredentials): Promise<{ valid: boolean; error?: string }>
  connect(creds: PlatformCredentials): Promise<{ connected: boolean; message?: string }>
  syncTrades(creds: PlatformCredentials, fromDate?: Date): Promise<SyncTrade[]>
  getAccountInfo?(creds: PlatformCredentials): Promise<{ name: string; balance?: number; currency?: string }>
}
