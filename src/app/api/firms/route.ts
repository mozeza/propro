import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const programType = searchParams.get('programType')
    const maxAccountSize = searchParams.get('maxAccountSize')

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (programType) {
      where.programTypes = { contains: programType, mode: 'insensitive' }
    }

    if (maxAccountSize) {
      where.maxAccountSize = { contains: maxAccountSize, mode: 'insensitive' }
    }

    const firms = await prisma.firm.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json(firms)
  } catch (error) {
    console.error('Error fetching firms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    )
  }
}
