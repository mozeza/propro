import Link from 'next/link';
import { firms } from '@/data/firms';
import FirmCard from '@/components/ui/firm-card';
import { ArrowRight, TrendingUp, Users, ShieldCheck, BarChart3, ListChecks, Gift } from 'lucide-react';

const stats = [
  { value: '50+', label: 'Firms', icon: TrendingUp },
  { value: '10,000+', label: 'Traders', icon: Users },
  { value: 'Best Deals', label: 'Exclusive Discounts', icon: ShieldCheck },
];

const features = [
  {
    icon: BarChart3,
    title: 'Smart Comparison',
    desc: 'Compare 50+ prop firms side by side. Filter by category, price, profit split, and more to find your perfect match.',
  },
  {
    icon: ListChecks,
    title: 'Track Your Trades',
    desc: 'Keep a detailed trading journal with built-in analytics. Review your performance and improve your strategy over time.',
  },
  {
    icon: Gift,
    title: 'Earn Rewards',
    desc: 'Get exclusive discounts and cashback on challenge fees. The more you compare, the more you save on funding programs.',
  },
];

export default function Home() {
  const topFirms = firms.sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background gradient effect */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[120px]" />
          <div className="absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-gold/[0.02] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            {/* Label */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-xs font-medium text-white/60">
                #1 Prop Firm Comparison Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Prop Firm
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
              Compare 50+ top prop trading firms. Get exclusive discounts. Track your performance.
            </p>

            {/* CTA */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
              >
                Compare Firms <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card flex items-center gap-4 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <stat.icon size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP FIRMS SECTION ========== */}
      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Top Prop Firms
              </h2>
              <p className="mt-2 text-sm text-white/40">
                Highest-rated prop trading firms ranked by trader reviews
              </p>
            </div>
            <Link
              href="/compare"
              className="hidden items-center gap-1.5 text-sm font-medium text-gold transition-opacity hover:opacity-80 sm:flex"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topFirms.map((firm) => (
              <FirmCard key={firm.id} firm={firm} featured={firm.rating >= 4.5} />
            ))}
          </div>

          {/* Mobile View All link */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold"
            >
              View All Firms <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Why Use ProPro?
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Everything you need to find the right prop firm and succeed
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <feature.icon size={22} className="text-gold" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARE CTA SECTION ========== */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-card p-10 sm:p-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to Find Your Firm?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
              Compare all 50+ prop firms side by side, filter by what matters to you, and claim exclusive discounts.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
              >
                Compare Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}