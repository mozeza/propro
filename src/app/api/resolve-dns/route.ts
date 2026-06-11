import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const host = searchParams.get('host')

  if (!host) {
    return NextResponse.json({ error: 'host parameter required' }, { status: 400 })
  }

  try {
    const addresses = await new Promise<string[]>((resolve, reject) => {
      dns.resolve4(host, (err, addresses) => {
        if (err) reject(err)
        else resolve(addresses)
      })
    })

    return NextResponse.json({
      host,
      ip: addresses[0] || null,
      all: addresses,
    })
  } catch (e: any) {
    return NextResponse.json({ host, ip: null, error: e.message })
  }
}