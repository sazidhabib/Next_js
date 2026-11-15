import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.webp';
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeFilename = `${Date.now()}_${cleanName}`;

    // Target upload directories: public/uploads (for direct Next.js static serving) and uploads/ (for Express/cPanel fallback)
    const publicUploadDir = join(process.cwd(), 'public', 'uploads');
    const rootUploadDir = join(process.cwd(), 'uploads');

    if (!existsSync(publicUploadDir)) {
      await mkdir(publicUploadDir, { recursive: true });
    }
    if (!existsSync(rootUploadDir)) {
      await mkdir(rootUploadDir, { recursive: true });
    }

    const publicFilePath = join(publicUploadDir, safeFilename);
    const rootFilePath = join(rootUploadDir, safeFilename);

    await Promise.all([
      writeFile(publicFilePath, buffer),
      writeFile(rootFilePath, buffer)
    ]);

    const fileUrl = `/uploads/${safeFilename}`;
    return NextResponse.json({
      success: true,
      url: fileUrl,
      path: fileUrl,
      message: 'File uploaded successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Upload error in Next.js route handler:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
