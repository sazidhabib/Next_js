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

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return NextResponse.json(
      { error: 'Internal server error reading file' },
      { status: 500 }
    );
  }
}
