import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const filename = `img-${uniqueSuffix}.webp`;
    const filePath = path.join(uploadsDir, filename);

    let outputBuffer;
    try {
      outputBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    } catch {
      outputBuffer = inputBuffer;
    }

    await writeFile(filePath, outputBuffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename, format: 'webp' });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
