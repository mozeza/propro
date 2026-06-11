'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { platformGuide, getGuide } from '@/data/platform-guide';
import type { ConnectionGuide } from '@/data/platform-guide';
import {
  TrendingUp, TrendingDown, Trash2, Plus, BarChart3, Target, DollarSign, Award,
  Upload, Link, Check, AlertCircle, FileText, RefreshCw,
  X, Activity, PieChart,
  Zap, Database, Monitor, Smartphone, Globe, Server
} from 'lucide-react';

interface Trade {
  id: string;
  instrument: string;
  direction: 'Buy' | 'Sell';
  entryPrice: number;
  exitPrice: number;
  lots: number;
  date: string;
  time?: string;
  notes: string;
  pnl: number;
  platform?: string;
  commission?: number;
  fees?: number;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'desktop' | 'web' | 'mobile' | 'api';
  fileFormats: string[];
  connected: boolean;
  popular: boolean;
}

const platforms: Platform[] = [
  { id: 'mt4', name: 'MetaTrader 4', icon: 'MT4', color: '#2196F3', type: 'desktop', fileFormats: ['.csv', '.hst'], connected: false, popular: true },
  { id: 'mt5', name: 'MetaTrader 5', icon: 'MT5', color: '#FF5722', type: 'desktop', fileFormats: ['.csv', '.hst'], connected: false, popular: true },
  { id: 'tradovate', name: 'Tradovate', icon: 'TD', color: '#4CAF50', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'tradingview', name: 'TradingView', icon: 'TV', color: '#2196F3', type: 'web', fileFormats: ['.csv', '.json'], connected: false, popular: true },
  { id: 'ctrader', name: 'cTrader', icon: 'cT', color: '#00BCD4', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'ninjatrader', name: 'NinjaTrader', icon: 'NT', color: '#9C27B0', type: 'desktop', fileFormats: ['.csv', '.txt'], connected: false, popular: true },
  { id: 'ibkr', name: 'Interactive Brokers', icon: 'IB', color: '#F44336', type: 'desktop', fileFormats: ['.csv', '.xml'], connected: false, popular: true },
  { id: 'schwab', name: 'Charles Schwab (TOS)', icon: 'CS', color: '#0054A8', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'robinhood', name: 'Robinhood', icon: 'RH', color: '#00C805', type: 'mobile', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'tradestation', name: 'TradeStation', icon: 'TS', color: '#1A73E8', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'webull', name: 'Webull', icon: 'WB', color: '#1A1A2E', type: 'mobile', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'etrade', name: 'Power E-Trade', icon: 'ET', color: '#008080', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'bybit', name: 'ByBit', icon: 'BB', color: '#F7A600', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'topstepx', name: 'TopstepX', icon: 'TX', color: '#FF6B35', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'oanda', name: 'OANDA', icon: 'OA', color: '#4DA6FF', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'coinbase', name: 'Coinbase', icon: 'CB', color: '#0052FF', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'ironbeam', name: 'IronBeam', icon: 'IR', color: '#6C63FF', type: 'api', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'alpaca', name: 'Alpaca', icon: 'AL', color: '#8B5CF6', type: 'api', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'etoro', name: 'eToro', icon: 'eT', color: '#A6C734', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'das', name: 'DAS Trader Pro', icon: 'DA', color: '#FF9800', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'dxtrade', name: 'DXtrade', icon: 'DX', color: '#3F51B5', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'matchtrader', name: 'Match-Trader', icon: 'MT', color: '#009688', type: 'mobile', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'rithmic', name: 'Rithmic R Trader', icon: 'RM', color: '#E91E63', type: 'api', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'sierra', name: 'Sierra Chart', icon: 'SC', color: '#607D8B', type: 'desktop', fileFormats: ['.csv', '.scid'], connected: false, popular: false },
  { id: 'tastytrade', name: 'TastyTrade', icon: 'TT', color: '#E53935', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'thinkorswim', name: 'ThinkorSwim', icon: 'TS', color: '#FF4081', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'quantower', name: 'Quantower', icon: 'QT', color: '#673AB7', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'bookmap', name: 'Bookmap', icon: 'BM', color: '#FFC107', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'lightspeed', name: 'Lightspeed', icon: 'LS', color: '#00BFA5', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'sterling', name: 'Sterling Trader Pro', icon: 'ST', color: '#B71C1C', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'tradezero', name: 'TradeZero', icon: 'TZ', color: '#1A237E', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'silexx', name: 'Silexx', icon: 'SX', color: '#880E4F', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'edgeprox', name: 'EdgeProX', icon: 'EP', color: '#795548', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'motifwave', name: 'MotiveWave', icon: 'MW', color: '#00695C', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'cqg', name: 'CQG Desktop', icon: 'CQ', color: '#1565C0', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'lseg', name: 'LSEG', icon: 'LG', color: '#1B1E3B', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'tefs', name: 'TEFS Evolution', icon: 'TE', color: '#2E7D32', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'tc2000', name: 'TC2000', icon: 'TC', color: '#00838F', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'questrade', name: 'Questrade', icon: 'QR', color: '#D84315', type: 'web', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'zerodha', name: 'Zerodha', icon: 'ZD', color: '#4285F4', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'tradier', name: 'Tradier', icon: 'TR', color: '#7B1FA2', type: 'api', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'atlas', name: 'Alpha Ticks', icon: 'AT', color: '#FF6F00', type: 'desktop', fileFormats: ['.csv'], connected: false, popular: false },
  { id: 'ftmo', name: 'FTMO', icon: 'FM', color: '#DC143C', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'tradelocker', name: 'TradeLocker', icon: 'TL', color: '#00ACC1', type: 'web', fileFormats: ['.csv'], connected: false, popular: true },
  { id: 'tddi', name: 'TD Direct Investing', icon: 'TI', color: '#0066CC', type: 'web', fileFormats: ['.csv'], connected: false, popular: false },
];

function calculatePnL(t: { direction: string; entryPrice: number; exitPrice: number; lots: number }): number {
  const diff = t.direction === 'Buy' ? t.exitPrice - t.entryPrice : t.entryPrice - t.exitPrice;
  return parseFloat((diff * t.lots).toFixed(2));
}

function parseCSV(text: string): Partial<Trade>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const result: Partial<Trade>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim());
    if (vals.length < 3) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
    result.push({
      instrument: row['instrument'] || row['symbol'] || row['pair'] || row['ticker'] || 'Unknown',
      direction: (row['direction'] || row['type'] || row['action'] || 'Buy').toLowerCase().includes('sell') ? 'Sell' : 'Buy',
      entryPrice: parseFloat(row['entry'] || row['entry price'] || row['open price'] || '0'),
      exitPrice: parseFloat(row['exit'] || row['exit price'] || row['close price'] || '0'),
      lots: parseFloat(row['lots'] || row['volume'] || row['size'] || row['quantity'] || '1'),
      date: row['date'] || row['open time']?.split(' ')[0] || new Date().toISOString().split('T')[0],
      time: row['time'] || row['open time']?.split(' ')[1] || '',
      notes: 'Imported from CSV',
      commission: parseFloat(row['commission'] || '0'),
      fees: parseFloat(row['swap'] || row['fees'] || '0'),
    });
  }
  return result;
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('propro_connected') : null;
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number; platform: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'analytics' | 'platforms'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [formFields, setFormFields] = useState({
    apiKey: '', apiSecret: '', username: '', password: '', login: '', investorPassword: '',
    server: '', customServer: ''
  });
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d?.id) setUserId(d.id);
    }).catch(() => {});
    // Load saved MT4 credentials for Sync Now
    try {
      const savedLogin = localStorage.getItem('propro_mt4_login');
      const savedServer = localStorage.getItem('propro_mt4_server');
      if (savedLogin || savedServer) {
        setFormFields(prev => ({ ...prev, login: savedLogin || prev.login, server: savedServer || prev.server }));
      }
    } catch {}
  }, []);

  const [form, setForm] = useState({
    instrument: '', direction: 'Buy' as 'Buy' | 'Sell',
    entryPrice: '', exitPrice: '', lots: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const totalTrades = trades.length;
  const winTrades = trades.filter(t => t.pnl > 0).length;
  const lossTrades = trades.filter(t => t.pnl <= 0).length;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
  const avgWin = winTrades > 0 ? trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / winTrades : 0;
  const avgLoss = lossTrades > 0 ? trades.filter(t => t.pnl <= 0).reduce((s, t) => s + t.pnl, 0) / lossTrades : 0;
  const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : avgWin > 0 ? Infinity : 0;
  const expectancy = totalTrades > 0 ? totalPnl / totalTrades : 0;

  const instrumentStats: Record<string, { trades: number; pnl: number; wins: number }> = {};
  trades.forEach(t => {
    if (!instrumentStats[t.instrument]) instrumentStats[t.instrument] = { trades: 0, pnl: 0, wins: 0 };
    instrumentStats[t.instrument].trades++;
    instrumentStats[t.instrument].pnl += t.pnl;
    if (t.pnl > 0) instrumentStats[t.instrument].wins++;
  });
  const topInstruments = Object.entries(instrumentStats).sort((a, b) => b[1].trades - a[1].trades).slice(0, 5);

  const monthlyPnl: Record<string, number> = {};
  trades.forEach(t => {
    const month = t.date.slice(0, 7);
    monthlyPnl[month] = (monthlyPnl[month] || 0) + t.pnl;
  });
  const months = Object.entries(monthlyPnl).sort((a, b) => a[0].localeCompare(b[0]));

  function handleAddTrade() {
    const entry = parseFloat(form.entryPrice);
    const exit = parseFloat(form.exitPrice);
    const lots = parseFloat(form.lots);
    if (!form.instrument || isNaN(entry) || isNaN(exit) || isNaN(lots) || !form.date) return;
    const td = { instrument: form.instrument, direction: form.direction, entryPrice: entry, exitPrice: exit, lots, date: form.date, notes: form.notes };
    const newTrade: Trade = { id: Date.now().toString(), ...td, pnl: calculatePnL(td) };
    setTrades(prev => [newTrade, ...prev]);
    setForm({ instrument: '', direction: 'Buy', entryPrice: '', exitPrice: '', lots: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowForm(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      const newTrades: Trade[] = parsed.map((t, i) => ({
        id: 'import-' + Date.now() + '-' + i,
        instrument: t.instrument || 'Unknown',
        direction: t.direction as 'Buy' | 'Sell',
        entryPrice: t.entryPrice || 0,
        exitPrice: t.exitPrice || 0,
        lots: t.lots || 1,
        date: t.date || new Date().toISOString().split('T')[0],
        time: t.time,
        notes: t.notes || 'Imported',
        pnl: calculatePnL({ direction: t.direction || 'Buy', entryPrice: t.entryPrice || 0, exitPrice: t.exitPrice || 0, lots: t.lots || 1 }),
        platform: file.name.includes('MT4') ? 'MetaTrader 4' : file.name.includes('MT5') ? 'MetaTrader 5' : 'CSV Import',
        commission: t.commission,
        fees: t.fees,
      }));
      setTrades(prev => [...newTrades, ...prev]);
      setImportResult({ count: newTrades.length, platform: file.name });
      setImporting(false);
      setShowImport(false);
      setTimeout(() => setImportResult(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function connectPlatform(platformId: string) {
    setConnectedPlatforms(prev => prev.includes(platformId) ? prev : [...prev, platformId]);
    const demoInstruments = ['ES', 'NQ', 'EURUSD', 'GBPUSD', 'CL', 'GC'];
    const demoTrades: Trade[] = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => {
      const instrument = demoInstruments[Math.floor(Math.random() * demoInstruments.length)];
      const direction = Math.random() > 0.5 ? 'Buy' : 'Sell';
      const entry = Math.random() * 100 + 50;
      const exit = entry + (Math.random() - 0.45) * 5;
      return {
        id: 'demo-' + platformId + '-' + Date.now() + '-' + i,
        instrument,
        direction,
        entryPrice: parseFloat(entry.toFixed(2)),
        exitPrice: parseFloat(exit.toFixed(2)),
        lots: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
        date: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString().split('T')[0],
        notes: 'Auto-imported from ' + (platforms.find(p => p.id === platformId)?.name || platformId),
        pnl: 0,
        platform: platforms.find(p => p.id === platformId)?.name || platformId,
      };
    });
    const finalTrades = demoTrades.map(t => ({ ...t, pnl: calculatePnL(t) }));
    setTrades(prev => [...finalTrades, ...prev]);
    setImportResult({ count: finalTrades.length, platform: platforms.find(p => p.id === platformId)?.name || platformId });
    setTimeout(() => setImportResult(null), 4000);
  }

  function clearAll() { setTrades([]); }

  const platformTypeIcons: Record<string, React.ReactNode> = {
    desktop: <Monitor size={12} />,
    web: <Globe size={12} />,
    mobile: <Smartphone size={12} />,
    api: <Server size={12} />,
  };

  return (
    <div className="flex flex-col">
      <section className="border-b border-white/5 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Trading Journal</h1>
              <p className="mt-2 text-sm text-white/40">Connect your platforms, auto-import trades, and analyze your performance</p>
            </div>
            <div className="flex items-center gap-3">
              {importResult && (
                <div className="animate-fade-in inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                  <Check size={12} /> {importResult.count} trades from {importResult.platform}
                </div>
              )}
              <button onClick={() => { setShowPlatforms(!showPlatforms); setShowImport(false); setShowForm(false); }}
                className={'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-all ' + (showPlatforms ? 'border-gold/30 bg-gold/10 text-gold' : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white')}>
                <Zap size={14} /> Connect Platform
              </button>
              <button onClick={() => { setShowImport(!showImport); setShowPlatforms(false); setShowForm(false); }}
                className={'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-all ' + (showImport ? 'border-gold/30 bg-gold/10 text-gold' : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white')}>
                <Upload size={14} /> Import CSV
              </button>
            </div>
          </div>
          {connectedPlatforms.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-white/30">Connected:</span>
              {connectedPlatforms.map(pid => {
                const p = platforms.find(pl => pl.id === pid);
                if (!p) return null;
                return (
                  <span key={pid} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {p.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showPlatforms && (
        <section className="border-b border-white/5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Connect Your Trading Platform</h2>
              <button onClick={() => setShowPlatforms(false)} className="text-xs text-white/30 hover:text-white/60"><X size={14} /></button>
            </div>
            <p className="mb-5 text-xs text-white/30">Select your platform to auto-import trades. We support all major trading platforms.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {platforms.map(platform => {
                const isConnected = connectedPlatforms.includes(platform.id);
                return (
                  <button key={platform.id} onClick={() => { if (!isConnected) setSelectedGuide(platform.id); }} disabled={isConnected}
                    className={'glass-card flex items-center gap-3 p-4 text-left transition-all ' + (isConnected ? 'border-success/20 opacity-60' : 'hover:border-white/20 hover:bg-white/[0.06] cursor-pointer')}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: platform.color + '30', borderColor: platform.color + '50', borderWidth: 1 }}>
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{platform.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-white/30">{platformTypeIcons[platform.type]}</span>
                        <span className="text-[10px] text-white/30 capitalize">{platform.type}</span>
                        {platform.popular && <span className="rounded bg-gold/20 px-1 py-0.5 text-[8px] font-medium text-gold">POPULAR</span>}
                      </div>
                    </div>
                    {isConnected ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20"><Check size={12} className="text-success" /></span>
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10"><Link size={10} className="text-white/30" /></span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedGuide && (() => {
              const guide = getGuide(selectedGuide);
              const plat = platforms.find(p => p.id === selectedGuide);
              if (!guide || !plat) return null;
              // Reset form fields when platform changes
              if (selectedGuide !== plat.id) {
                setTimeout(() => setFormFields({apiKey: '', apiSecret: '', username: '', password: '', login: '', investorPassword: '', server: '', customServer: ''}), 0);
              }
              return (
                <div className="mt-4 animate-fade-in rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: plat.color + '30', border: '1px solid ' + plat.color + '50' }}>{plat.icon}</div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{plat.name}</h3>
                        <span className={'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ' + (guide.connectionType === 'sync' ? 'bg-blue-500/10 text-blue-400' : guide.connectionType === 'file' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400')}>
                          {guide.connectionType === 'sync' ? 'Auto Sync' : guide.connectionType === 'file' ? 'File Upload' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedGuide(null)} className="text-xs text-white/30 hover:text-white/60"><X size={14} /></button>
                  </div>
                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/30">What You Need</p>
                      <p className="text-xs font-medium text-white">{guide.credentials}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/30">Difficulty</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3].map(i => (<span key={i} className={'h-2 w-6 rounded-full ' + (i <= guide.difficulty ? 'bg-gold' : 'bg-white/10')} />))}
                        <span className="ml-1 text-xs text-white/40">{guide.difficulty === 1 ? 'Easy' : guide.difficulty === 2 ? 'Medium' : 'Complex'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">What We Do With Your Credentials</p>
                    <div className="whitespace-pre-wrap rounded-lg border border-gold/10 bg-gold/[0.03] p-3 text-xs leading-relaxed text-white/60">{guide.whatWeDo}</div>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">How to Get Credentials</p>
                    <div className="whitespace-pre-wrap rounded-lg border border-gold/10 bg-gold/[0.03] p-3 text-xs leading-relaxed text-white/60">{guide.howToGet}</div>
                  </div>
                  {guide.notes && (
                    <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                      <p className="text-xs text-white/40"><strong className="text-white/50">Note:</strong> {guide.notes}</p>
                    </div>
                  )}
                  <div className="mb-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Enter Your Credentials</p>
                    <div className="space-y-2">
                      {guide.connectionType === 'sync' && (
                        <>
                          {(plat.id === 'bybit' || plat.id === 'coinbase') && (
                            <>
                              <input type="text" placeholder="API Key" value={formFields.apiKey} onChange={e => setFormFields({...formFields, apiKey: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                              <input type="password" placeholder="API Secret / Private Key" value={formFields.apiSecret} onChange={e => setFormFields({...formFields, apiSecret: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                            </>
                          )}
                          {plat.id === 'tradovate' && (
                            <>
                              <input type="text" placeholder="Username" value={formFields.username} onChange={e => setFormFields({...formFields, username: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                              <input type="password" placeholder="Password" value={formFields.password} onChange={e => setFormFields({...formFields, password: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                            </>
                          )}
                          {(plat.id === 'mt4' || plat.id === 'mt5') && (
                            <>
                              <div className="rounded-lg border border-blue-500/10 bg-blue-500/[0.03] px-3 py-2 mb-2">
                                <p className="text-[10px] text-blue-300/60">Direct TCP Connection via Investor Password</p>
                              </div>
                              <select value={formFields.server} onChange={e => setFormFields({...formFields, server: e.target.value})}
                                className="glass-input w-full px-3 py-2 text-sm mb-2">
                                <option value="">Select your broker...</option>
                                <option value="roboforex">RoboForex (mt5.roboforex.com)</option>
                                <option value="ftmo">FTMO (mt4.ftmo.com)</option>
                                <option value="apex">Apex Trader Funding</option>
                                <option value="fundingpips">Funding Pips</option>
                                <option value="fundednext">FundedNext</option>
                                <option value="the5ers">The5ers</option>
                                <option value="icmarkets">IC Markets</option>
                                <option value="pepperstone">Pepperstone</option>
                                <option value="exness">Exness</option>
                                <option value="blueguardian">Blue Guardian</option>
                                <option value="other">Other (enter manually)</option>
                              </select>
                              {formFields.server === 'other' && (
                                <input type="text" placeholder="Server address (e.g. mt4.broker.com:443)" value={formFields.customServer} onChange={e => setFormFields({...formFields, customServer: e.target.value})} className="glass-input w-full px-3 py-2 text-sm mb-2" />
                              )}
                              <input type="text" placeholder="Login Number" value={formFields.login} onChange={e => setFormFields({...formFields, login: e.target.value})} className="glass-input w-full px-3 py-2 text-sm mb-2" />
                              <input type="password" placeholder="Investor Password" value={formFields.investorPassword} onChange={e => setFormFields({...formFields, investorPassword: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                              <div className="mt-2 rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] px-3 py-2">
                                <p className="text-[10px] text-yellow-300/50">Investor Password is different from your regular password! Find it in MT4 Mailbox tab.</p>
                              </div>
                            </>
                          )}
                          {plat.id === 'oanda' && (
                            <input type="text" placeholder="API Key (Personal Access Token)" value={formFields.apiKey} onChange={e => setFormFields({...formFields, apiKey: e.target.value})} className="glass-input w-full px-3 py-2 text-sm" />
                          )}
                        </>
                      )}
                      {guide.connectionType === 'file' && (
                        <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-xs text-white/40">
                          Export CSV from {plat.name} and use the &quot;Import CSV&quot; button above.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={async () => {
                      if (!userId) { alert('Please sign in first'); return; }
                      const loading = document.createElement('div');
                      try {
                        if (selectedGuide === 'mt4' || selectedGuide === 'mt5') {
                          if (!formFields.server && !formFields.customServer) { alert('Please select a broker server'); return; }
                          if (!formFields.login) { alert('Please enter your Login Number'); return; }
                          if (!formFields.investorPassword) { alert('Please enter your Investor Password'); return; }
                          // First, try to link EA fingerprint to this account
                          if (formFields.login && !formFields.investorPassword.includes(' ')) {
                            try {
                              await fetch('/api/ea/link', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  userId,
                                  login: formFields.login,
                                  server: formFields.customServer || formFields.server,
                                  broker: formFields.server,
                                })
                              });
                            } catch {}
                          }
                        } else if (!formFields.apiKey && !formFields.apiSecret && !formFields.username && !formFields.password) {
                          alert('Please enter your credentials first');
                          return;
                        }
                        const creds: Record<string, string> = {};
                        if (formFields.apiKey) creds.apiKey = formFields.apiKey;
                        if (formFields.apiSecret) creds.apiSecret = formFields.apiSecret;
                        if (formFields.username) creds.username = formFields.username;
                        if (formFields.password) creds.password = formFields.password;
                        if (formFields.login) creds.login = formFields.login;
                        if (formFields.investorPassword) creds.investorPassword = formFields.investorPassword;
                        if (formFields.server) creds.server = formFields.server;
                        if (formFields.customServer) creds.server = formFields.customServer;

                        const res = await fetch('/api/sync', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ platformId: selectedGuide, credentials: creds, userId })
                        });
                        
                        if (!res.ok) {
                          const errText = await res.text();
                          alert('Server Error (' + res.status + '): ' + errText.slice(0, 200));
                          setSelectedGuide(null);
                          return;
                        }
                        
                        const data = await res.json();

                        if (data.success) {
                          connectPlatform(selectedGuide);
                          // Save credentials to localStorage for Sync Now button
                          try {
                            localStorage.setItem('propro_mt4_login', formFields.login || '');
                            localStorage.setItem('propro_mt4_server', formFields.customServer || formFields.server || '');
                          } catch {}
                          setImportResult({ count: data.count || data.tradesCount || 0, platform: plat.name });
                          setTimeout(() => setImportResult(null), 6000);
                        } else {
                          alert('❌ ' + (data.message || JSON.stringify(data) || 'Unknown error'));
                        }
                      } catch (e: any) {
                        alert('💥 Network/Server Error:\n' + (e.message || e.toString() || 'Connection failed'));
                        console.error('Sync error:', e);
                      }
                      setSelectedGuide(null);
                    }}
                      className="flex-1 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs font-medium text-gold transition-all hover:bg-gold/20">Connect {plat.name}</button>
                    <button onClick={() => setSelectedGuide(null)}
                      className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-white/40 transition-all hover:border-white/30 hover:text-white/60">Cancel</button>
                  </div>
                </div>
              );
            })()}
            {!selectedGuide && (
              <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                <p className="text-xs text-white/30"><strong className="text-white/50">Tip:</strong> Select a platform above to see connection instructions.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {showImport && (
        <section className="border-b border-white/5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Import Trades from CSV</h2>
              <button onClick={() => setShowImport(false)} className="text-xs text-white/30 hover:text-white/60"><X size={14} /></button>
            </div>
            <p className="mb-5 text-xs text-white/30">Export trade history from any platform as CSV and upload here.</p>
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) { const inp = fileInputRef.current; if (inp) { const dt = new DataTransfer(); dt.items.add(f); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true })); } } }}
              className={'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all ' + (dragOver ? 'border-gold/50 bg-gold/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20')}
              onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept=".csv,.txt,.json" onChange={handleFileUpload} className="hidden" />
              {importing ? <RefreshCw size={32} className="mb-3 animate-spin text-gold" /> : <Upload size={32} className="mb-3 text-white/20" />}
              <p className="text-sm font-medium text-white/60">{importing ? 'Importing...' : 'Drop CSV file here or click to browse'}</p>
              <p className="mt-1 text-xs text-white/30">Supports 45+ trading platforms</p>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 mt-6 flex items-center gap-1 border-b border-white/5">
          {[
            { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { id: 'trades' as const, label: 'Trades', icon: Activity },
            { id: 'analytics' as const, label: 'Analytics', icon: PieChart },
            { id: 'platforms' as const, label: 'Platforms', icon: Database },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={'flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-medium transition-all ' + (activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-white/30 hover:text-white/50')}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <section className="mb-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {[
                  { label: 'Total Trades', value: totalTrades, icon: BarChart3, color: 'text-white' },
                  { label: 'Win Rate', value: winRate + '%', icon: Target, color: winRate >= 50 ? 'text-success' : 'text-danger' },
                  { label: 'Total P&L', value: '$' + totalPnl.toFixed(0), icon: DollarSign, color: totalPnl >= 0 ? 'text-success' : 'text-danger' },
                  { label: 'Profit Factor', value: profitFactor === Infinity ? String.fromCharCode(8734) : profitFactor.toFixed(2), icon: TrendingUp, color: profitFactor >= 1.5 ? 'text-success' : 'text-danger' },
                  { label: 'Expectancy', value: '$' + expectancy.toFixed(2), icon: Target, color: expectancy >= 0 ? 'text-success' : 'text-danger' },
                  { label: 'Best Trade', value: '$' + bestTrade.toFixed(0), icon: Award, color: 'text-white' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card p-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <stat.icon size={12} className="text-white/20" />
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{stat.label}</p>
                    </div>
                    <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {months.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-white">Monthly Performance</h2>
                <div className="glass-card p-5">
                  <div className="space-y-2">
                    {months.map(([month, pnl]) => {
                      const maxPnl = Math.max(...months.map(m => Math.abs(m[1])));
                      const barWidth = maxPnl > 0 ? (Math.abs(pnl) / maxPnl) * 100 : 0;
                      return (
                        <div key={month} className="flex items-center gap-3">
                          <span className="w-16 text-[10px] text-white/30">{month}</span>
                          <div className="flex-1">
                            <div className="h-5 w-full overflow-hidden rounded-full bg-white/5">
                              <div className={cn('h-full rounded-full transition-all', pnl >= 0 ? 'bg-success/30' : 'bg-danger/30')}
                                style={{ width: barWidth + '%', marginLeft: pnl < 0 ? 'auto' : undefined }} />
                            </div>
                          </div>
                          <span className={cn('w-20 text-right text-xs font-medium', pnl >= 0 ? 'text-success' : 'text-danger')}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {topInstruments.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-white">Top Instruments</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topInstruments.map(([instrument, stats]) => (
                    <div key={instrument} className="glass-card flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{instrument}</p>
                        <p className="text-xs text-white/30">{stats.trades} trades - {stats.trades > 0 ? Math.round((stats.wins / stats.trades) * 100) : 0}% win rate</p>
                      </div>
                      <p className={cn('text-sm font-bold', stats.pnl >= 0 ? 'text-success' : 'text-danger')}>
                        {stats.pnl >= 0 ? '+' : ''}${stats.pnl.toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {trades.length === 0 && (
              <div className="glass-card flex flex-col items-center justify-center py-16">
                <BarChart3 size={40} className="mb-4 text-white/10" />
                <p className="text-sm text-white/40">No trades yet</p>
                <p className="mt-1 text-xs text-white/20">Connect a platform, import CSV, or add trades manually</p>
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => setShowPlatforms(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white">
                    <Zap size={12} /> Connect Platform
                  </button>
                  <button onClick={() => setShowImport(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white">
                    <Upload size={12} /> Import CSV
                  </button>
                  <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white">
                    <Plus size={12} /> Manual Entry
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'trades' && (
          <>
            <section className="mb-6">
              {!showForm ? (
                <button onClick={() => setShowForm(true)} className="glass-card flex w-full items-center justify-center gap-2 p-4 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:text-white">
                  <Plus size={16} /> Add Trade Manually
                </button>
              ) : (
                <div className="glass-card p-5">{/* form fields */}</div>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Trade History ({totalTrades})</h2>
                {trades.length > 0 && (
                  <button onClick={clearAll}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-medium text-white/30 transition-all hover:border-white/30 hover:text-white/60">
                    <Trash2 size={10} /> Clear All
                  </button>
                )}
              </div>
              {trades.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center py-12">
                  <Activity size={28} className="mb-3 text-white/10" />
                  <p className="text-sm text-white/30">No trades recorded</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {trades.map(trade => (
                    <div key={trade.id} className="glass-card flex items-center gap-3 px-4 py-3 transition-all hover:border-white/15">
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold', trade.pnl >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger')}>
                        {trade.pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{trade.instrument}</span>
                          <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-medium', trade.direction === 'Buy' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger')}>{trade.direction}</span>
                          {trade.platform && <span className="text-[9px] text-white/20">{trade.platform}</span>}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-white/25">
                          <span>{trade.entryPrice}{' > '}{trade.exitPrice}</span>
                          <span>-</span>
                          <span>{trade.lots} lots</span>
                          <span>-</span>
                          <span>{trade.date}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn('text-sm font-bold', trade.pnl >= 0 ? 'text-success' : 'text-danger')}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {trades.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-16">
                <PieChart size={40} className="mb-4 text-white/10" />
                <p className="text-sm text-white/40">No data to analyze yet</p>
                <p className="mt-1 text-xs text-white/20">Import trades to see your performance analytics</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Win Rate', value: winRate + '%', sub: winTrades + 'W / ' + lossTrades + 'L', color: winRate >= 50 ? 'text-success' : 'text-danger' },
                    { label: 'Avg Win', value: '$' + avgWin.toFixed(2), sub: 'per winning trade', color: 'text-success' },
                    { label: 'Avg Loss', value: '$' + avgLoss.toFixed(2), sub: 'per losing trade', color: 'text-danger' },
                    { label: 'Profit Factor', value: profitFactor === Infinity ? String.fromCharCode(8734) : profitFactor.toFixed(2), sub: profitFactor >= 1.5 ? 'Good' : 'Needs improvement', color: profitFactor >= 1.5 ? 'text-success' : 'text-danger' },
                  ].map(metric => (
                    <div key={metric.label} className="glass-card p-5">
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{metric.label}</p>
                      <p className={cn('mt-1 text-2xl font-bold', metric.color)}>{metric.value}</p>
                      <p className="mt-0.5 text-[10px] text-white/20">{metric.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="glass-card p-5">
                  <h3 className="mb-4 text-sm font-semibold text-white">Win / Loss Distribution</h3>
                  <div className="flex h-8 w-full overflow-hidden rounded-full bg-white/5">
                    {totalTrades > 0 && (
                      <>
                        <div className="flex items-center justify-center bg-success/30 text-[10px] font-medium text-success transition-all" style={{ width: winRate + '%' }}>
                          {winRate > 10 ? winRate + '%' : ''}
                        </div>
                        <div className="flex items-center justify-center bg-danger/30 text-[10px] font-medium text-danger transition-all" style={{ width: (100 - winRate) + '%' }}>
                          {winRate < 90 ? (100 - winRate) + '%' : ''}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {months.length > 0 && (
                  <div className="glass-card p-5">
                    <h3 className="mb-4 text-sm font-semibold text-white">Monthly P&L</h3>
                    <div className="space-y-2">
                      {months.map(([month, pnl]) => {
                        const maxAbs = Math.max(...months.map(m => Math.abs(m[1])));
                        const pct = maxAbs > 0 ? (Math.abs(pnl) / maxAbs) * 100 : 0;
                        return (
                          <div key={month} className="flex items-center gap-3">
                            <span className="w-16 text-[10px] text-white/30">{month}</span>
                            <div className="relative flex-1">
                              <div className="h-6 w-full overflow-hidden rounded-full bg-white/5">
                                <div className={cn('h-full rounded-full transition-all', pnl >= 0 ? 'bg-success/30' : 'bg-danger/30')}
                                  style={{ width: pct + '%', marginLeft: pnl < 0 ? (100 - pct) + '%' : '0%' }} />
                              </div>
                            </div>
                            <span className={cn('w-20 text-right text-xs font-medium', pnl >= 0 ? 'text-success' : 'text-danger')}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'platforms' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Connected Platforms</h2>
              <button onClick={() => setShowPlatforms(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-medium text-white/40 transition-all hover:border-white/30 hover:text-white">
                <Plus size={10} /> Add Platform
              </button>
            </div>
            {connectedPlatforms.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-12">
                <Database size={32} className="mb-3 text-white/10" />
                <p className="text-sm text-white/40">No platforms connected</p>
                <p className="mt-1 text-xs text-white/20">Connect your trading platform to auto-import trades</p>
                <button onClick={() => setShowPlatforms(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold transition-all hover:bg-gold/20">
                  <Zap size={12} /> Connect Now
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {connectedPlatforms.map(pid => {
                  const p = platforms.find(pl => pl.id === pid);
                  if (!p) return null;
                  const platformTrades = trades.filter(t => t.platform === p.name);
                  return (
                    <div key={pid} className="glass-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: p.color + '30', border: '1px solid ' + p.color + '50' }}>{p.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{p.name}</p>
                            <span className="flex h-2 w-2 rounded-full bg-success" />
                          </div>
                          <p className="text-[10px] text-white/30">{platformTrades.length} trades imported</p>
                        </div>
                        <button onClick={() => { setConnectedPlatforms(prev => prev.filter(id => id !== pid)); }}
                          className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-white/30 transition-all hover:border-danger/30 hover:text-danger">Disconnect</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
