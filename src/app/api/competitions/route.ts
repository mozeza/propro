import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const competitions = await prisma.competition.findMany({
      where: {
        status: { in: ['upcoming', 'active'] },
      },
      orderBy: { startDate: 'asc' },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    })

    return NextResponse.json(competitions)
  } catch (error) {
    console.error('Error fetching competitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, competitionId } = body

    if (!userId || !competitionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, competitionId' },
        { status: 400 }
      )
    }

    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    })

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    if (competition.status !== 'active' && competition.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Competition is not open for entries' },
        { status: 400 }
      )
    }

    if (competition.maxEntries) {
      const entryCount = await prisma.competitionEntry.count({
        where: { competitionId },
      })
      if (entryCount >= competition.maxEntries) {
        return NextResponse.json(
          { error: 'Competition is full' },
          { status: 400 }
        )
      }
    }

    if (competition.entryFee > 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      if (!user || user.totalCredits < competition.entryFee) {
        return NextResponse.json(
          { error: 'Insufficient credits for entry fee' },
          { status: 400 }
        )
      }
    }

    const existingEntry = await prisma.competitionEntry.findUnique({
      where: {
        userId_competitionId: { userId, competitionId },
      },
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Already entered this competition' },
        { status: 409 }
      )
    }

    const entry = await prisma.competitionEntry.create({
      data: {
        userId,
        competitionId,
      },
    })

    if (competition.entryFee > 0) {
      await prisma.creditTransaction.create({
        data: {
          userId,
          amount: -competition.entryFee,
          type: 'challenge_purchase',
          description: `Entry fee for competition: ${competition.name}`,
          referenceId: competitionId,
        },
      })
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalCredits: { decrement: competition.entryFee },
        },
      })
    }

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating competition entry:', error)
    return NextResponse.json(
      { error: 'Failed to create competition entry' },
      { status: 500 }
    )
  }
}
