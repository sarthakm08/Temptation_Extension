import { NextRequest, NextResponse } from 'next/server';
import { runAgentOrchestration } from '@/lib/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, apiKey, model } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    // Determine API key from server environment or user client
    const effectiveKey = apiKey?.trim() || process.env.GEMINI_API_KEY || '';
    const effectiveModel = model?.trim() || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const project = await runAgentOrchestration(prompt, effectiveKey, effectiveModel);

    return NextResponse.json({
      success: true,
      project
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { error: `Orchestration error: ${message}` },
      { status: 500 }
    );
  }
}
