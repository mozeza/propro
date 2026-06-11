import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function calculateMatchScore(firm: {
  category: string
  challengePriceRange: string | null
  features: string | null
}, markets: string, budget: string, style: string): number {
  let score = 0
  const maxScore = 3

  const marketMap: Record<string, string[]> = {
    futures: ['futures', 'future', 'commodities'],
    forex: ['forex', 'currency', 'fx'],
    crypto: ['crypto', 'cryptocurrency'],
    multiple: ['futures', 'forex', 'crypto'],
  }
  const marketKeywords = marketMap[markets] || []
  if (marketKeywords.some((kw) => firm.category?.toLowerCase().includes(kw))) {
    score += 1.5
  }

  const budgetRanges: Record<string, [number, number]> = {
    under50: [0, 50],
    '50-100': [50, 100],
    '100-200': [100, 200],
    '200+': [200, 99999],
  }
  const range = budgetRanges[budget]
  if (range && firm.challengePriceRange) {
    const nums = firm.challengePriceRange.match(/\d+/g)
    if (nums) {
      const prices = nums.map(Number)
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      if (avgPrice >= range[0] && avgPrice <= range[1]) score += 1
    }
  }

  const styleKeywords: Record<string, string[]> = {
    day: ['day', 'intraday', 'daily'],
    swing: ['swing', 'position'],
    scalper: ['scalp', 'scalper', 'fast'],
    'long-term': ['long-term', 'growth', 'scaling'],
  }
  const keywords = styleKeywords[style] || []
  const features = firm.features?.toLowerCase() || ''
  if (keywords.some((kw) => features.includes(kw))) score += 0.5

  return (score / maxScore) * 100
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.markets || !body.budget || !body.style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const firms = await prisma.firm.findMany()

    const scored = firms.map((firm: { category: string; challengePriceRange: string | null; features: string | null }) => ({
      ...firm,
      matchPercentage: Math.round(calculateMatchScore(firm, body.markets, body.budget, body.style)),
    }))

    scored.sort((a: { matchPercentage: number }, b: { matchPercentage: number }) => b.matchPercentage - a.matchPercentage)

    return NextResponse.json({ recommendations: scored.slice(0, 3) })
  } catch (error) {
    console.error('Quiz error:', error)
    return NextResponse.json({ error: 'Failed to process quiz' }, { status: 500 })
  }
}
