import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    const clerkId = session?.userId
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Find or create user in our DB
    let user = await prisma.user.findUnique({ where: { clerkId } })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: clerkId + '@propro.app',
          clerkId,
          name: 'Trader',
        }
      })
    }

    return NextResponse.json({ id: user.id, clerkId: user.clerkId, email: user.email, name: user.name })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to get user' }, { status: 500 })
  }
}
