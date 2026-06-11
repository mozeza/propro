'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Trophy,
  Users,
  Medal,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Star,
  TrendingUp,
  Swords,
} from 'lucide-react';

interface Competition {
  name: string;
  description: string;
  prize: string;
  status: 'active' | 'upcoming';
  entries: number;
  maxEntries: number;
  icon: React.ReactNode;
}

const competitions: Competition[] = [
  {
    name: 'Weekly Leaderboard',
    description: 'Top % Return This Week',
    prize: '$50K Challenge',
    status: 'active',
    entries: 234,
    maxEntries: 500,
    icon: <TrendingUp size={20} className="text-gold" />,
  },
  {
    name: 'Monthly Championship',
    description: 'Best Sharpe Ratio',
    prize: '$100K Account',
    status: 'active',
    entries: 156,
    maxEntries: 300,
    icon: <Trophy size={20} className="text-gold" />,
  },
  {
    name: 'Prop Firm Gauntlet',
    description: 'Most Challenges Passed',
    prize: '$200K+ Cash',
    status: 'upcoming',
    entries: 89,
    maxEntries: 200,
    icon: <Swords size={20} className="text-gold" />,
  },
];

interface LeaderboardEntry {
  rank: number;
  name: string;
  returnPct: number;
  trades: number;
  prize: string;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Trader_Alpha', returnPct: 42.5, trades: 87, prize: '$50K Challenge' },
  { rank: 2, name: 'Trader_Omega', returnPct: 38.2, trades: 64, prize: '$25K Challenge' },
  { rank: 3, name: 'Trader_Vega', returnPct: 31.7, trades: 53, prize: '$10K Challenge' },
  { rank: 4, name: 'Trader_Delta', returnPct: 28.9, trades: 91, prize: '' },
  { rank: 5, name: 'Trader_Gamma', returnPct: 25.4, trades: 45, prize: '' },
  { rank: 6, name: 'Trader_Theta', returnPct: 22.1, trades: 78, prize: '' },
  { rank: 7, name: 'Trader_Sigma', returnPct: 19.8, trades: 62, prize: '' },
  { rank: 8, name: 'Trader_Beta', returnPct: 17.3, trades: 55, prize: '' },
  { rank: 9, name: 'Trader_Epsilon', returnPct: 14.6, trades: 43, prize: '' },
  { rank: 10, name: 'Trader_Zeta', returnPct: 12.0, trades: 39, prize: '' },
];

function TrophyIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={16} className="text-gold" />;
  if (rank === 2) return <Medal size={16} className="text-white/60" />;
  if (rank === 3) return <Medal size={16} className="text-amber-600/80" />;
  return <span className="text-xs font-medium text-white/30">#{rank}</span>;
}

export default function CompetitionsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-white/5 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Trading Competitions
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Compete against other traders, win prizes, and prove your skills
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* 1. Active Competitions */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Challenges
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => (
              <div
                key={comp.name}
                className="glass-card p-6 transition-all duration-200 hover:border-white/20"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    {comp.icon}
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                      comp.status === 'active'
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-white/5 text-white/30 border border-white/10'
                    )}
                  >
                    {comp.status === 'active' ? 'Live' : 'Upcoming'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white">{comp.name}</h3>
                <p className="mt-1 text-sm text-white/40">{comp.description}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Trophy size={14} className="text-gold" />
                  <span className="text-sm font-medium text-gold">{comp.prize}</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                    <span>Entries</span>
                    <span>
                      {comp.entries}/{comp.maxEntries}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gold/60"
                      style={{ width: `${(comp.entries / comp.maxEntries) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  disabled={comp.status === 'upcoming'}
                  className={cn(
                    'mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-all',
                    comp.status === 'active'
                      ? 'border-gold/30 bg-gold/10 text-gold hover:bg-gold/20'
                      : 'border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed'
                  )}
                >
                  {comp.status === 'active' ? (
                    <>
                      Enter Competition
                      <ArrowRight size={14} />
                    </>
                  ) : (
                    'Coming Soon'
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Current Leaderboard */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Current Leaderboard
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Top traders by return percentage this week
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Users size={12} />
              <span>{leaderboardData.length} traders</span>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/30">
                      Rank
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/30">
                      Trader
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                      Return %
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                      Trades
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                      Prize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, i) => (
                    <tr
                      key={entry.name}
                      className={cn(
                        'border-b border-white/5 transition-colors hover:bg-white/[0.02]',
                        i < 3 && 'bg-gold/[0.02]'
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <TrophyIcon rank={entry.rank} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-white">
                          {entry.name}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={cn(
                            'text-sm font-bold',
                            entry.returnPct >= 20 ? 'text-success' : 'text-white'
                          )}
                        >
                          +{entry.returnPct}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-white/50">
                        {entry.trades}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {entry.prize ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-gold">
                            <Trophy size={10} />
                            {entry.prize}
                          </span>
                        ) : (
                          <span className="text-sm text-white/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 sm:hidden">
            {leaderboardData.map((entry, i) => (
              <div
                key={entry.name}
                className={cn(
                  'glass-card flex items-center gap-3 px-4 py-3',
                  i < 3 && 'border-gold/10'
                )}
              >
                <div className="flex w-8 items-center justify-center">
                  <TrophyIcon rank={entry.rank} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-white/30">{entry.trades} trades</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">+{entry.returnPct}%</p>
                  {entry.prize && (
                    <p className="text-[10px] text-gold">{entry.prize}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Note */}
        <section className="mt-10">
          <div className="glass-card flex items-center gap-3 px-6 py-4">
            <Sparkles size={16} className="text-gold" />
            <p className="text-sm text-white/40">
              <span className="text-white/70">Real competitions start when users join.</span>{' '}
              The leaderboard above shows sample data to demonstrate how competitions will work.
              Actual trading competitions with real prizes will launch soon.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}