import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getUploadsDir } from '@/lib/uploads';
import { getAuthSession } from '@/lib/auth/rbac';

export async function POST(request) {
  try {
    const session = await getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Active session required to upload files' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit (10MB)' },
        { status: 400 }
      );
    }

    const ext = (path.extname(file.name) || '').toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'File format not allowed. Supported formats: JPG, PNG, WebP, PDF.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = getUploadsDir();
    await fs.mkdir(uploadsDir, { recursive: true });

    // Sanitize filename and create unique name
    const safeName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_') || 'file';
    const uniqueFileName = `${safeName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
