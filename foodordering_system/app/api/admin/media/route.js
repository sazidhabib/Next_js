import { NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper to ensure directory exists
async function ensureUploadsDir() {
  await mkdir(UPLOADS_DIR, { recursive: true });
}

// GET: List all media files
export async function GET(request) {
  try {
    await ensureUploadsDir();
    const files = await readdir(UPLOADS_DIR);
    
    // Filter image files only
    const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif'];
    const imageFiles = files.filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return imageExtensions.includes(ext);
    });

    const mediaList = [];

    for (const filename of imageFiles) {
      try {
        const filePath = path.join(UPLOADS_DIR, filename);
        const stats = await stat(filePath);
        
        mediaList.push({
          id: filename,
          filename: filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          createdAt: stats.birthtime || stats.mtime,
          modifiedAt: stats.mtime,
          isWebp: path.extname(filename).toLowerCase() === '.webp',
        });
      } catch (err) {
        console.warn(`Error reading stats for ${filename}:`, err.message);
      }
    }

    // Sort newest first
    mediaList.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

    return NextResponse.json({
      success: true,
      data: mediaList,
      total: mediaList.length,
    });
  } catch (error) {
    console.error('Failed to list media files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media files' },
      { status: 500 }
    );
  }
}

// POST: Upload & convert image to optimized WebP
export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No valid image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    await ensureUploadsDir();

    // Generate unique WebP filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    const originalName = (file.name || 'image').replace(/\.[^/.]+$/, '');
    const cleanSlug = originalName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .slice(0, 30);
    const filename = `${cleanSlug || 'img'}-${uniqueSuffix}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    let outputBuffer;
    let metadata = {};

    try {
      // Process and optimize with Sharp:
      // - Max width 1600px (preserve aspect ratio)
      // - WebP quality 82 (great quality with high compression)
      const pipeline = sharp(inputBuffer)
        .rotate() // auto-orient based on EXIF
        .resize({
          width: 1600,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({
          quality: 82,
          effort: 4,
          lossless: false,
        });

      outputBuffer = await pipeline.toBuffer();
      metadata = await sharp(outputBuffer).metadata();
    } catch (sharpError) {
      console.warn('Sharp conversion fallback (saving original buffer):', sharpError.message);
      // Fallback if format is not supported by Sharp (e.g. raw SVG)
      outputBuffer = inputBuffer;
    }

    await writeFile(filePath, outputBuffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: outputBuffer.length,
      sizeFormatted: formatBytes(outputBuffer.length),
      originalSize: inputBuffer.length,
      savedPercent: Math.round(((inputBuffer.length - outputBuffer.length) / inputBuffer.length) * 100),
      width: metadata.width || null,
      height: metadata.height || null,
      format: 'webp',
    });
  } catch (error) {
    console.error('Image processing & upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process and upload image' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an image
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ success: false, error: 'Filename is required' }, { status: 400 });
    }

    // Security: sanitize filename to avoid path traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    await unlink(filePath);

    return NextResponse.json({ success: true, message: `Image ${safeFilename} deleted successfully` });
  } catch (error) {
    console.error('Failed to delete media file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file or file does not exist' },
      { status: 500 }
    );
  }
}

// Utility: Format bytes
function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
