import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const firm = await prisma.firm.findUnique({
      where: { slug },
    })

    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(firm)
  } catch (error) {
    console.error('Error fetching firm:', error)
    return NextResponse.json(
      { error: 'Failed to fetch firm' },
      { status: 500 }
    )
  }
}
