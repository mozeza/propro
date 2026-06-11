'use client';

import { useState } from 'react';
import { firms, type PropFirm } from '@/data/firms';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Star,
  ArrowUpRight,
  Check,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
  Mail,
} from 'lucide-react';

type Step = 'markets' | 'budget' | 'style' | 'email' | 'results';

interface Answer {
  markets: string | null;
  budget: string | null;
  style: string | null;
}

const marketOptions = [
  { value: 'Futures', icon: TrendingUp, desc: 'Index futures, commodities' },
  { value: 'Forex', icon: DollarSign, desc: 'Currency pairs' },
  { value: 'Crypto', icon: BarChart3, desc: 'Digital assets' },
  { value: 'Multiple', icon: Zap, desc: 'I trade everything' },
];

const budgetOptions = [
  { value: 'Under $50', range: [0, 50] },
  { value: '$50-$100', range: [50, 100] },
  { value: '$100-$200', range: [100, 200] },
  { value: '$200+', range: [200, Infinity] },
];

const styleOptions = [
  { value: 'Day Trader', icon: Zap, desc: 'Open and close positions within the same day' },
  { value: 'Swing Trader', icon: TrendingUp, desc: 'Hold positions for days to weeks' },
  { value: 'Scalper', icon: BarChart3, desc: 'Very short-term, high frequency' },
  { value: 'Long-term', icon: ArrowRight, desc: 'Hold positions for weeks to months' },
];

function parsePriceRange(range: string): { min: number; max: number } {
  const parts = range.replace('$', '').split(' - ');
  const min = parseInt(parts[0]?.replace(/[^0-9]/g, '') || '0', 10);
  const max = parseInt(parts[1]?.replace(/[^0-9]/g, '') || '99999', 10);
  return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? 99999 : max };
}

function parseMaxSize(size: string): number {
  const num = parseInt(size.replace(/[$,]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function calculateMatches(answer: Answer): { firm: PropFirm; score: number; percentage: number }[] {
  const scored = firms.map((firm) => {
    let score = 0;
    let maxScore = 3;

    // Markets match
    if (answer.markets === 'Multiple') {
      score += 1;
    } else if (answer.markets) {
      const marketLower = answer.markets.toLowerCase();
      const categoryMap: Record<string, string> = {
        futures: 'futures',
        forex: 'forex',
        crypto: 'crypto',
      };
      if (firm.category === categoryMap[marketLower] || firm.category === 'hybrid' || firm.category === 'instant') {
        score += 1;
      } else if (
        firm.features.some((f) => f.toLowerCase().includes(marketLower)) ||
        firm.description.toLowerCase().includes(marketLower)
      ) {
        score += 0.5;
      }
    }

    // Budget match
    if (answer.budget) {
      const budgetMap: Record<string, [number, number]> = {
        'Under $50': [0, 50],
        '$50-$100': [50, 100],
        '$100-$200': [100, 200],
        '$200+': [200, Infinity],
      };
      const [budgetMin, budgetMax] = budgetMap[answer.budget] || [0, Infinity];
      const { min: priceMin, max: priceMax } = parsePriceRange(firm.challengePriceRange);
      if (priceMin <= budgetMax && priceMax >= budgetMin) {
        score += 1;
      } else if (priceMin <= budgetMax * 1.5) {
        score += 0.5;
      }
    }

    // Style match
    if (answer.style) {
      const styleKeywords: Record<string, string[]> = {
        'Day Trader': ['day', 'daily', 'active', 'intraday'],
        'Swing Trader': ['swing', 'no time limit', 'no time', 'flexible'],
        Scalper: ['scalping', 'fast', 'high frequency', 'rapid'],
        'Long-term': ['long', 'long-term', 'growth', 'scaling', 'development'],
      };
      const keywords = styleKeywords[answer.style] || [];
      const matchesFeature = keywords.some((kw) =>
        firm.features.some((f) => f.toLowerCase().includes(kw))
      );
      const matchesDesc = keywords.some((kw) =>
        firm.description.toLowerCase().includes(kw)
      );
      if (matchesFeature || matchesDesc) {
        score += 1;
      } else {
        score += 0.5;
      }
    }

    const percentage = Math.round((score / maxScore) * 100);
    return { firm, score, percentage };
  });

  return scored
    .filter((s) => s.percentage >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function QuizPage() {
  const [step, setStep] = useState<Step>('markets');
  const [answer, setAnswer] = useState<Answer>({
    markets: null,
    budget: null,
    style: null,
  });
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<ReturnType<typeof calculateMatches> | null>(null);
  const [slideDir, setSlideDir] = useState<'forward' | 'back'>('forward');

  const steps = ['markets', 'budget', 'style', 'email'];
  const stepIndex = steps.indexOf(step);
  const totalSteps = steps.length;
  const progress = stepIndex + 1;

  function handleSelect(key: keyof Answer, value: string) {
    setAnswer((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setSlideDir('forward');
    const stepOrder: Step[] = ['markets', 'budget', 'style', 'email', 'results'];
    const cur = stepOrder.indexOf(step);
    if (cur < stepOrder.length - 1) {
      const next = stepOrder[cur + 1];
      if (next === 'results') {
        const matches = calculateMatches(answer);
        setResults(matches);
      }
      setStep(next);
    }
  }

  function goBack() {
    setSlideDir('back');
    const stepOrder: Step[] = ['markets', 'budget', 'style', 'email', 'results'];
    const cur = stepOrder.indexOf(step);
    if (cur > 0) {
      setStep(stepOrder[cur - 1]);
    }
  }

  function startOver() {
    setAnswer({ markets: null, budget: null, style: null });
    setEmail('');
    setResults(null);
    setStep('markets');
    setSlideDir('forward');
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const matches = calculateMatches(answer);
    setResults(matches);
    setStep('results');
  }

  const canProceed =
    step === 'email' ? email.trim().length > 0 : answer[step as keyof Answer] !== null;

  // Confetti sparkle positions
  const sparkles = [
    { top: '10%', left: '5%', size: 16, delay: '0s' },
    { top: '20%', right: '8%', size: 12, delay: '0.3s' },
    { top: '50%', left: '3%', size: 14, delay: '0.6s' },
    { top: '70%', right: '5%', size: 18, delay: '0.9s' },
    { top: '85%', left: '10%', size: 10, delay: '1.2s' },
    { top: '15%', left: '50%', size: 14, delay: '0.4s' },
    { top: '40%', right: '3%', size: 13, delay: '0.7s' },
    { top: '60%', left: '7%', size: 11, delay: '1.0s' },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-white/5 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Find Your Perfect Prop Firm
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Answer 3 quick questions and get personalized recommendations
          </p>
        </div>
      </section>

      {/* Quiz Content */}
      <section className="relative flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {step !== 'results' && (
            <>
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white/50">
                    Step {progress}/{totalSteps}
                  </span>
                  <span className="text-xs text-white/30">
                    {step === 'markets' ? 'Markets' : step === 'budget' ? 'Budget' : step === 'style' ? 'Style' : 'Your Email'}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${(progress / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Back button */}
              {stepIndex > 0 && (
                <button
                  onClick={goBack}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              )}

              {/* Question card */}
              <div
                key={step}
                className={cn(
                  'glass-card p-8 transition-all duration-300',
                  slideDir === 'forward' ? 'animate-fade-in' : 'animate-slide-up'
                )}
              >
                {step === 'markets' && (
                  <>
                    <h2 className="mb-2 text-xl font-semibold text-white">
                      What markets do you trade?
                    </h2>
                    <p className="mb-6 text-sm text-white/40">
                      Select the primary market you trade most often
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {marketOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect('markets', opt.value)}
                          className={cn(
                            'group relative rounded-xl border p-5 text-left transition-all duration-200',
                            'bg-white/[0.03] backdrop-blur-[12px]',
                            answer.markets === opt.value
                              ? 'border-gold bg-gold/5'
                              : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <opt.icon
                                size={18}
                                className={cn(
                                  answer.markets === opt.value ? 'text-gold' : 'text-white/50'
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{opt.value}</p>
                              <p className="mt-0.5 text-xs text-white/40">{opt.desc}</p>
                            </div>
                            {answer.markets === opt.value && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                                <Check size={12} className="text-black" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 'budget' && (
                  <>
                    <h2 className="mb-2 text-xl font-semibold text-white">
                      What&apos;s your budget for a challenge?
                    </h2>
                    <p className="mb-6 text-sm text-white/40">
                      How much are you willing to spend on a trading challenge
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect('budget', opt.value)}
                          className={cn(
                            'group relative rounded-xl border p-5 text-left transition-all duration-200',
                            'bg-white/[0.03] backdrop-blur-[12px]',
                            answer.budget === opt.value
                              ? 'border-gold bg-gold/5'
                              : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <DollarSign
                                size={18}
                                className={cn(
                                  answer.budget === opt.value ? 'text-gold' : 'text-white/50'
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{opt.value}</p>
                            </div>
                            {answer.budget === opt.value && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                                <Check size={12} className="text-black" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 'style' && (
                  <>
                    <h2 className="mb-2 text-xl font-semibold text-white">
                      What&apos;s your trading style?
                    </h2>
                    <p className="mb-6 text-sm text-white/40">
                      How do you typically approach the markets
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {styleOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect('style', opt.value)}
                          className={cn(
                            'group relative rounded-xl border p-5 text-left transition-all duration-200',
                            'bg-white/[0.03] backdrop-blur-[12px]',
                            answer.style === opt.value
                              ? 'border-gold bg-gold/5'
                              : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <opt.icon
                                size={18}
                                className={cn(
                                  answer.style === opt.value ? 'text-gold' : 'text-white/50'
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{opt.value}</p>
                              <p className="mt-0.5 text-xs text-white/40">{opt.desc}</p>
                            </div>
                            {answer.style === opt.value && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                                <Check size={12} className="text-black" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 'email' && (
                  <>
                    <h2 className="mb-2 text-xl font-semibold text-white">
                      Get your personalized recommendation
                    </h2>
                    <p className="mb-6 text-sm text-white/40">
                      Enter your email to see your top 3 matched prop firms
                    </p>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="glass-input w-full pl-10 pr-4 py-3 text-sm"
                          required
                        />
                      </div>
                      <p className="text-xs text-white/30">
                        We&apos;ll never share your email. Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                )}

                {/* Next / Continue button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={step === 'email' ? handleEmailSubmit : goNext}
                    disabled={!canProceed}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-medium transition-all',
                      canProceed
                        ? 'border-gold/30 bg-gold/10 text-gold hover:bg-gold/20'
                        : 'border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed'
                    )}
                  >
                    {step === 'email' ? 'Show Results' : 'Continue'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* RESULTS */}
          {step === 'results' && results && (
            <div className="relative animate-fade-in">
              {/* Sparkles / Confetti */}
              {sparkles.map((s, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute animate-pulse"
                  style={{
                    top: s.top,
                    left: s.left,
                    right: s.right,
                    animationDelay: s.delay,
                    opacity: 0.5,
                  }}
                >
                  <Sparkles size={s.size} className="text-gold/40" />
                </span>
              ))}

              {/* Results header */}
              <div className="mb-8 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5">
                  <Sparkles size={14} className="text-gold" />
                  <span className="text-xs font-medium text-gold">Your Results</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Top {results.length} Firms for You
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  Based on your answers, here are your best-matched prop firms
                </p>
              </div>

              {/* Result cards */}
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.firm.id}
                    className={cn(
                      'glass-card p-6 transition-all duration-300',
                      index === 0 && 'ring-1 ring-gold/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Rank */}
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                            index === 0
                              ? 'bg-gold/20 text-gold'
                              : index === 1
                                ? 'bg-white/10 text-white/70'
                                : 'bg-white/5 text-white/50'
                          )}
                        >
                          {index === 0 ? (
                            <Star size={18} className="fill-gold text-gold" />
                          ) : (
                            `#${index + 1}`
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {result.firm.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/40">
                            <span className="capitalize">{result.firm.category}</span>
                            <span>{result.firm.challengePriceRange}</span>
                            <span>Up to {result.firm.maxAccountSize}</span>
                          </div>

                          {/* Match percentage bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-white/50">Match</span>
                              <span className="font-medium text-gold">
                                {result.percentage}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                                style={{ width: `${result.percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Key stats */}
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-white/30">
                                Profit Target
                              </p>
                              <p className="text-sm font-medium text-white">
                                {result.firm.profitTarget}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-white/30">
                                Drawdown
                              </p>
                              <p className="text-sm font-medium text-white">
                                {result.firm.maxDrawdown}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-white/30">
                                Rating
                              </p>
                              <div className="flex items-center gap-1">
                                <Star size={12} className="fill-gold text-gold" />
                                <span className="text-sm font-medium text-white">
                                  {result.firm.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href={result.firm.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 py-2.5 text-sm font-medium text-gold transition-all hover:bg-gold/20"
                      >
                        Get Deal
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Over */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={startOver}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-white/50 transition-all hover:border-white/30 hover:text-white"
                >
                  <RotateCcw size={14} />
                  Start Over
                </button>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/10"
                >
                  View All Firms
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}