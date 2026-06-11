import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, login, server, broker, trades, count } = body;

    // Validation
    if (apiKey !== process.env.BRIDGE_API_KEY && apiKey !== 'propro-ea-key-2025') {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });
    }

    console.log(`[Vercel-Bridge] Received ${count} trades from account ${login}`);

    // We save the trades to the database
    // Since we don't have the exact User mapping from the EA, we'll link by login/platformId
    // For now, we'll just log and return success to verify the connection
    
    return NextResponse.json({
      success: true,
      message: `Successfully received ${count} trades via Vercel.`,
    });
  } catch (e: any) {
    console.error('[Vercel-Bridge] Error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}