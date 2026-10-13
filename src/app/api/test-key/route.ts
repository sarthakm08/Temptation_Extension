import { NextRequest, NextResponse } from 'next/server';
import { testGeminiConnection } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, model } = body;

    const keyToTest = apiKey?.trim() || process.env.GEMINI_API_KEY || '';

    if (!keyToTest) {
      return NextResponse.json({
        success: false,
        message: 'No Gemini API Key provided. Set GEMINI_API_KEY in environment or input in Settings.'
      });
    }

    const result = await testGeminiConnection(keyToTest, model || 'gemini-3.8-flash');
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Test failed';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
