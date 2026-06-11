'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Coins,
  Gift,
  Clock,
  Trophy,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';

interface RewardItem {
  name: string;
  cost: number;
  description: string;
  icon: string;
}

const rewards: RewardItem[] = [
  { name: '$50K Challenge', cost: 500, description: 'Free entry to a $50K funded challenge', icon: '🏆' },
  { name: '$100K Challenge', cost: 1000, description: 'Free entry to a $100K funded challenge', icon: '💎' },
  { name: 'Trading Course Bundle', cost: 750, description: 'Premium trading education package', icon: '📚' },
  { name: 'Premium Discord Access', cost: 300, description: 'Exclusive Discord community access', icon: '💬' },
  { name: 'Pro Merch', cost: 200, description: 'Official ProPro merchandise pack', icon: '👕' },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-sm">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-white">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/30">d</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-white">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/30">h</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-white">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/30">m</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-white">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/30">s</span>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-white/5 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Rewards Hub
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Earn credits, enter giveaways, and redeem exclusive rewards
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* 1. Credits Balance */}
        <section className="mb-10">
          <div className="glass-card relative overflow-hidden p-8">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/[0.03] blur-[60px]" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                  <Coins size={28} className="text-gold" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">0</p>
                  <p className="text-sm font-medium text-gold">Credits</p>
                  <p className="mt-1 text-xs text-white/30">
                    Coming soon: Earn credits on every purchase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Weekly Giveaway */}
        <section className="mb-10">
          <div className="glass-card relative overflow-hidden p-8">
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-gold/[0.04] blur-[80px]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5">
                <Gift size={12} className="text-gold" />
                <span className="text-xs font-medium text-gold">Weekly Giveaway</span>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    $100K Challenge - Free Entry
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    Enter for a chance to win a fully funded $100K challenge — no purchase necessary.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 sm:items-end">
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <Clock size={12} />
                    <span>Ends in</span>
                  </div>
                  <CountdownTimer />
                  <button
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-5 py-2 text-sm font-medium transition-all',
                      'border-gold/30 bg-gold/10 text-gold hover:bg-gold/20'
                    )}
                  >
                    Enter Giveaway
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Rewards Store */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Rewards Store</h2>
              <p className="mt-1 text-sm text-white/40">
                Redeem your credits for exclusive rewards
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <ShoppingBag size={12} />
              <span>{rewards.length} items</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {rewards.map((reward) => (
              <div
                key={reward.name}
                className="glass-card group p-5 transition-all duration-200 hover:border-white/20"
              >
                <div className="mb-3 text-3xl">{reward.icon}</div>
                <h3 className="text-sm font-semibold text-white">{reward.name}</h3>
                <p className="mt-1 text-xs text-white/40">{reward.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Coins size={14} className="text-gold" />
                    <span className="text-sm font-medium text-gold">{reward.cost}</span>
                  </div>
                  <button
                    disabled
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                      'border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed'
                    )}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-6 py-4">
            <AlertCircle size={14} className="text-white/30" />
            <p className="text-xs text-white/30">
              Credit earning and redemption will be available soon. Stay tuned!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}