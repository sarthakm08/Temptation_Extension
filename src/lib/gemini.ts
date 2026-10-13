export interface GeminiConfig {
  apiKey?: string;
  model?: string;
}

export async function testGeminiConnection(apiKey: string, model = 'gemini-3.8-flash'): Promise<{ success: boolean; message: string; model?: string }> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { success: false, message: 'API key is required.' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Respond with the word "PONG" if you are online.' }]
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      return { success: false, message: msg };
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
      success: true,
      message: `Successfully connected to Gemini API (${model}). Response: ${reply.trim().slice(0, 50)}`,
      model
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Connection error: ${msg}` };
  }
}

export async function callGeminiForExtension(
  prompt: string,
  apiKey: string,
  model = 'gemini-3.8-flash'
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
    
    const systemPrompt = `You are an elite Chrome Extension Architect and Manifest V3 Developer for TEMPTATION AI.
Given a user request, produce a complete JSON specification for the extension adhering strictly to Manifest V3 rules:
- No Manifest V2 APIs
- No eval or inline scripts
- Minimal necessary permissions
- Real files only (manifest.json, popup.html, popup.js, popup.css, content.js, content.css, etc.)

Return ONLY valid JSON matching this schema:
{
  "name": "string",
  "version": "1.0.0",
  "description": "string",
  "targetSites": ["string"],
  "permissions": ["string"],
  "hostPermissions": ["string"],
  "components": ["popup", "content_script", "service_worker", "options"],
  "features": ["string"],
  "limitations": ["string"],
  "files": [
    {
      "path": "string",
      "language": "json" | "javascript" | "html" | "css" | "markdown",
      "description": "string",
      "content": "string"
    }
  ]
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `User Request: "${prompt}"` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err?.error?.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return { success: false, error: 'Empty response received from Gemini.' };
    }

    const parsed = JSON.parse(rawText);
    return { success: true, data: parsed };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}
