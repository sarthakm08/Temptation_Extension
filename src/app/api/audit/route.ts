import { NextRequest, NextResponse } from 'next/server';
import { runSecurityAudit } from '@/lib/agents/securityAuditorAgent';
import { validateExtension } from '@/lib/agents/validatorAgent';
import { GeneratedFile } from '@/types/extension';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { files, permissions, hostPermissions } = body as {
      files: GeneratedFile[];
      permissions?: string[];
      hostPermissions?: string[];
    };

    if (!Array.isArray(files)) {
      return NextResponse.json({ error: 'Files array is required.' }, { status: 400 });
    }

    const validation = validateExtension(files);
    const security = runSecurityAudit(files, permissions || [], hostPermissions || []);

    return NextResponse.json({
      success: true,
      validation,
      security
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Audit failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
