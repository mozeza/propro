'use client';

import { useState, useMemo } from 'react';
import { firms } from '@/data/firms';
import FirmCard from '@/components/ui/firm-card';
import { cn } from '@/lib/utils';
import { Search, Grid3X3, List } from 'lucide-react';

const categories = ['all', 'futures', 'forex', 'crypto', 'instant', 'hybrid'] as const;
type Category = (typeof categories)[number];

const accountSizeOptions = [
  'All',
  '$100,000',
  '$150,000',
  '$200,000',
  '$250,000',
  '$300,000',
  '$400,000',
];

function parseMaxSize(size: string): number {
  const num = parseInt(size.replace(/[$,]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

const allProgramTypes = [...new Set(firms.flatMap((f) => f.programTypes))].sort();
const programTypeOptions = ['All', ...allProgramTypes];

export default function ComparePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [programType, setProgramType] = useState('All');
  const [maxAccountSize, setMaxAccountSize] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFirms = useMemo(() => {
    return firms.filter((firm) => {
      // Category filter
      if (activeCategory !== 'all' && firm.category !== activeCategory) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !firm.name.toLowerCase().includes(q) &&
          !firm.description.toLowerCase().includes(q)
        )
          return false;
      }

      // Program type filter
      if (programType !== 'All' && !firm.programTypes.includes(programType)) return false;

      // Max account size filter
      if (maxAccountSize !== 'All') {
        const maxSize = parseMaxSize(maxAccountSize);
        const firmSize = parseMaxSize(firm.maxAccountSize);
        if (firmSize > maxSize) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, programType, maxAccountSize]);

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b border-white/5 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Compare Prop Firms
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Browse, filter, and compare {firms.length} prop trading firms to find the best fit for you.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-[12px]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Category pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-lg border px-4 py-1.5 text-xs font-medium capitalize transition-all',
                  activeCategory === cat
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/70'
                )}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Search + Filters row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search firms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-9 pr-3 py-2 text-sm"
              />
            </div>

            {/* Program Type */}
            <select
              value={programType}
              onChange={(e) => setProgramType(e.target.value)}
              className="glass-input px-3 py-2 text-sm sm:w-48"
            >
              {programTypeOptions.map((pt) => (
                <option key={pt} value={pt}>
                  {pt === 'All' ? 'All Programs' : pt}
                </option>
              ))}
            </select>

            {/* Max Account Size */}
            <select
              value={maxAccountSize}
              onChange={(e) => setMaxAccountSize(e.target.value)}
              className="glass-input px-3 py-2 text-sm sm:w-48"
            >
              {accountSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size === 'All' ? 'Max Account Size' : `Up to ${size}`}
                </option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-white/10 text-white'
                    : 'text-white/30 hover:text-white/60'
                )}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-white/10 text-white'
                    : 'text-white/30 hover:text-white/60'
                )}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Counter */}
          <p className="mb-6 text-sm text-white/40">
            Showing{' '}
            <span className="font-medium text-white">{filteredFirms.length}</span>
            {' '}of{' '}
            <span className="font-medium text-white">{firms.length}</span>
            {' '}firms
          </p>

          {filteredFirms.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center py-20">
              <p className="text-base text-white/40">No firms match your filters</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setProgramType('All');
                  setMaxAccountSize('All');
                }}
                className="mt-3 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'flex flex-col gap-4'
              )}
            >
              {filteredFirms.map((firm) => (
                <FirmCard key={firm.id} firm={firm} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}