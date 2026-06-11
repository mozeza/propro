import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, login, server, broker, trades, count } = body;

    // Validation
    if (apiKey !== 'propro-ea-key-2025') {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });
    }

    console.log(`[Vercel-Bridge] RECEIVED DATA: Account ${login}, ${count} trades.`);
    
    // Temporarily bypass DB to verify connectivity
    return NextResponse.json({
      success: true,
      message: `Success! Received ${count} trades from account ${login}. Bridge is LIVE.`,
    });
  } catch (e: any) {
    console.error('[Vercel-Bridge] Critical Error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}