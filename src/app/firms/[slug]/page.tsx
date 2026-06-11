'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { firms, getFirmBySlug } from '@/data/firms';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowUpRight,
  Star,
  Check,
  ExternalLink,
  TrendingUp,
  BarChart3,
  DollarSign,
  Shield,
  Target,
  Clock,
  Award,
  Users,
  Zap,
} from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} size={16} className="fill-gold text-gold" />
      );
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} className="relative">
          <Star size={16} className="text-white/20" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={16} className="fill-gold text-gold" />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star key={i} size={16} className="text-white/20" />
      );
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">{stars}</div>
      <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
      <span className="text-xs text-white/30">Trustpilot</span>
    </div>
  );
}

const categoryColors: Record<string, string> = {
  futures: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  forex: 'bg-green-500/10 text-green-400 border-green-500/20',
  crypto: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  instant: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  hybrid: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export default function FirmDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const firm = getFirmBySlug(slug);

  if (!firm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="glass-card flex flex-col items-center p-12 text-center max-w-md">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <BarChart3 size={28} className="text-white/30" />
          </div>
          <h2 className="text-xl font-bold text-white">Firm Not Found</h2>
          <p className="mt-2 text-sm text-white/40">
            We couldn&apos;t find a prop firm matching &quot;{slug}&quot;. Check the URL or browse all firms.
          </p>
          <Link
            href="/compare"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            Back to Compare
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Price Range', value: firm.challengePriceRange, icon: DollarSign },
    { label: 'Profit Target', value: firm.profitTarget, icon: Target },
    { label: 'Max Drawdown', value: firm.maxDrawdown, icon: Shield },
    { label: 'Max Account', value: firm.maxAccountSize, icon: TrendingUp },
    { label: 'Founded', value: firm.foundedYear.toString(), icon: Clock },
    { label: 'Country', value: firm.country, icon: Users },
  ];

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} />
            Back to Compare
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-8 pb-10">
          <div className="glass-card relative overflow-hidden p-8 sm:p-10">
            {/* Decorative bg */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/[0.02] blur-[100px]" />

            <div className="relative">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-5">
                  {/* Logo placeholder */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl font-bold text-white/70">
                    {firm.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {firm.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          'inline-block rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize',
                          categoryColors[firm.category] || 'bg-white/5 text-white/50'
                        )}
                      >
                        {firm.category}
                      </span>
                      {firm.isNew && (
                        <span className="rounded-md border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                          NEW
                        </span>
                      )}
                      {firm.discountCode && (
                        <span className="rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                          {firm.discountDescription || `Code: ${firm.discountCode}`}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <StarRating rating={firm.rating} />
                      <p className="mt-1 text-xs text-white/30">
                        Based on {firm.reviewCount.toLocaleString()} reviews
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={firm.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-medium text-gold transition-all hover:bg-gold/20"
                >
                  Get Exclusive Deal
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm leading-relaxed text-white/50 max-w-3xl">
                {firm.description}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-white">Key Details</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <stat.icon size={16} className="text-gold" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-white">Features</h2>
          <div className="glass-card p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {firm.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-sm text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-white">Program Types</h2>
          <div className="flex flex-wrap gap-2">
            {firm.programTypes.map((program) => (
              <span
                key={program}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60"
              >
                {program}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="glass-card relative overflow-hidden p-8 text-center">
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-gold/[0.03] blur-[80px]" />
            <div className="relative">
              <h2 className="text-xl font-bold text-white">
                Ready to Trade with {firm.name}?
              </h2>
              <p className="mt-2 text-sm text-white/40">
                Get exclusive discounts and start your funded trading journey today
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <a
                  href={firm.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-medium text-gold transition-all hover:bg-gold/20"
                >
                  Get Exclusive Deal
                  <ArrowUpRight size={14} />
                </a>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
                >
                  Compare All Firms
                  <ArrowLeft size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}