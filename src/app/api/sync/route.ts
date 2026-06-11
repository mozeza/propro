import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Read raw text first to avoid JSON parsing errors that cause 500s
    const rawText = await req.text();
    console.log('[Vercel-Bridge] Raw Request Received');
    
    let body;
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON format' }, { status: 400 });
    }

    const { apiKey, login, count } = body;

    if (apiKey !== 'propro-ea-key-2025') {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });
    }

    console.log(`[Vercel-Bridge] Success: Account ${login}, ${count} trades.`);
    
    return NextResponse.json({
      success: true,
      message: `Success! Received ${count} trades from account ${login}.`,
    });
  } catch (e: any) {
    console.error('[Vercel-Bridge] Critical Error:', e.message);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}