import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Star, ArrowUpRight, Tag } from 'lucide-react';
import type { PropFirm } from '@/data/firms';

interface FirmCardProps {
  firm: PropFirm;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  futures: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  forex: 'bg-green-500/10 text-green-400 border-green-500/20',
  crypto: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  instant: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  hybrid: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} size={14} className="fill-gold text-gold" />
      );
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} className="relative">
          <Star size={14} className="text-white/20" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={14} className="fill-gold text-gold" />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star key={i} size={14} className="text-white/20" />
      );
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">{stars}</div>
      <span className="text-xs font-medium text-white/50">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function FirmCard({ firm, featured = false }: FirmCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl border transition-all duration-250',
        'bg-white/[0.03] backdrop-blur-[12px]',
        'border-white/[0.06]',
        'hover:bg-white/[0.06] hover:border-white/[0.10] hover:shadow-lg',
        'hover:scale-[1.02] hover:shadow-white/5',
        featured && 'ring-1 ring-gold/20'
      )}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-px left-6 right-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 rounded-b-md bg-gold/20 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            <Tag size={10} /> Featured
          </span>
        </div>
      )}

      <div className={cn('p-5', featured && 'pt-7')}>
        {/* Header: Logo placeholder + name + badge */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white/70">
              {firm.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {firm.name}
              </h3>
              <span
                className={cn(
                  'inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize leading-tight',
                  categoryColors[firm.category] || 'bg-white/5 text-white/50'
                )}
              >
                {firm.category}
              </span>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <span className="text-xs text-white/40">Price range</span>
          <p className="text-sm font-medium text-white">{firm.challengePriceRange}</p>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={firm.rating} />
        </div>

        {/* Features (first 3) */}
        <div className="mb-4 space-y-1.5">
          {firm.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold/60" />
              <span className="text-xs text-white/50">{feature}</span>
            </div>
          ))}
        </div>

        {/* Discount badge */}
        {firm.discountCode && (
          <div className="mb-4 rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5">
            <span className="text-xs font-medium text-green-400">
              {firm.discountDescription || `Code: ${firm.discountCode}`}
            </span>
          </div>
        )}

        {/* CTA */}
        <a
          href={firm.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
            'border border-white/20 bg-white/5 text-white',
            'hover:border-white/40 hover:bg-white/10'
          )}
        >
          Get Deal
          <ArrowUpRight size={14} className="text-white/40" />
        </a>
      </div>
    </div>
  );
}