import fs from 'node:fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { ensureRenderDirs, getUploadFilePath } from '@/lib/render/workspace';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await ensureRenderDirs();
    const formData = await req.formData();
    const file = formData.get('file');
    const assetIdRaw = formData.get('assetId');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file field' }, { status: 400 });
    }

    const assetId =
      typeof assetIdRaw === 'string' && assetIdRaw.trim().length > 0
        ? assetIdRaw.trim()
        : `upload_${Date.now()}`;

    const targetPath = getUploadFilePath(assetId, file.name);
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, bytes);

    return NextResponse.json({
      ok: true,
      assetId,
      fileName: file.name,
      sizeBytes: bytes.byteLength,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
