import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { connectToPlatform, syncPlatformTrades, listAdapters, validatePlatformCredentials } from '@/lib/sync/engine'

// GET /api/platforms - List user's connected platforms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    // List available adapters
    if (action === 'adapters') {
      return NextResponse.json(listAdapters())
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const platforms = await prisma.platformConnection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 })
  }
}

// POST /api/platforms - Connect a platform
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, platformId, platformName, credentials, action } = body

    // Validate credentials only
    if (action === 'validate') {
      const result = await validatePlatformCredentials(platformId, credentials || {})
      return NextResponse.json(result)
    }

    // Connect and sync
    if (action === 'connect') {
      if (!userId || !platformId || !credentials) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Connect to platform
      const connectionResult = await connectToPlatform(platformId, credentials)
      if (!connectionResult.connected) {
        return NextResponse.json({ error: connectionResult.message || 'Connection failed' }, { status: 400 })
      }

      // Save connection to database
      const platform = await prisma.platformConnection.upsert({
        where: { userId_platformId: { userId, platformId } },
        update: { status: 'connected', metadata: JSON.stringify(credentials), lastSyncAt: new Date() },
        create: { userId, platformId, platformName, status: 'connected', metadata: JSON.stringify(credentials) },
      })

      // Sync trades
      const syncResult = await syncPlatformTrades(platformId, credentials, userId)

      return NextResponse.json({ platform, sync: syncResult })
    }

    // Manual platform connection (existing behavior)
    const existingBody = body as { userId: string; platformId: string; platformName: string; metadata?: string }
    if (!existingBody.userId || !existingBody.platformId || !existingBody.platformName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const platform = await prisma.platformConnection.upsert({
      where: { userId_platformId: { userId: existingBody.userId, platformId: existingBody.platformId } },
      update: { status: 'connected', metadata: existingBody.metadata || null },
      create: { userId: existingBody.userId, platformId: existingBody.platformId, platformName: existingBody.platformName, metadata: existingBody.metadata || null },
    })

    return NextResponse.json(platform, { status: 201 })
  } catch (error: any) {
    console.error('Error connecting platform:', error)
    return NextResponse.json({ error: error.message || 'Failed to connect platform' }, { status: 500 })
  }
}

// DELETE /api/platforms - Disconnect a platform
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const platformId = searchParams.get('platformId')

    if (!userId || !platformId) {
      return NextResponse.json({ error: 'userId and platformId are required' }, { status: 400 })
    }

    await prisma.platformConnection.delete({
      where: { userId_platformId: { userId, platformId } },
    })

    return NextResponse.json({ disconnected: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}