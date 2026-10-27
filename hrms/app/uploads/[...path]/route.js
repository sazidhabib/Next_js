import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { findUploadedFile, getMimeType } from '@/lib/uploads';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const pathSegments = params?.path || [];
    const relativePath = Array.isArray(pathSegments)
      ? pathSegments.join('/')
      : String(pathSegments);

    if (!relativePath) {
      return NextResponse.json({ error: 'File path missing' }, { status: 400 });
    }

    const fullPath = findUploadedFile(relativePath);

    if (!fullPath) {
      return NextResponse.json(
        { error: `File not found: ${relativePath}` },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(fullPath);
    const mimeType = getMimeType(fullPath);

    const headers = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    };

    // Sandbox SVGs to prevent executing embedded JavaScript
    if (mimeType === 'image/svg+xml') {
      headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'";
      headers['Content-Disposition'] = 'inline; filename="image.svg"';
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return NextResponse.json(
      { error: 'Internal server error reading file' },
      { status: 500 }
    );
  }
}
