import { NextResponse } from 'next/server';
import { initDb, MediaFile } from '@/lib/db/models/index';
import fs from 'fs/promises';
import path from 'path';

const INITIAL_MEDIA = [
  {
    filename: 'avatar_tariq.webp',
    originalName: 'Tariq Ahmed Profile Photo.webp',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 92000,
    category: 'EMPLOYEE_PHOTO',
  },
  {
    filename: 'avatar_elena.webp',
    originalName: 'Elena Rostova Profile Photo.webp',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 86000,
    category: 'EMPLOYEE_PHOTO',
  },
  {
    filename: 'avatar_james.webp',
    originalName: 'James Wilson Profile Photo.webp',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 88000,
    category: 'EMPLOYEE_PHOTO',
  },
  {
    filename: 'avatar_ananya.webp',
    originalName: 'Ananya Patel Profile Photo.webp',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 96000,
    category: 'EMPLOYEE_PHOTO',
  },
  {
    filename: 'sample_passport_scan.webp',
    originalName: 'Home Office Passport Scan Standard.webp',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 110000,
    category: 'PASSPORT',
  },
  {
    filename: 'company_brand_logo.webp',
    originalName: 'Curry Lounge Brand Logo.webp',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
    fileType: 'image/webp',
    fileSize: 74000,
    category: 'LOGO',
  },
];

export async function GET(request) {
  try {
    await initDb();
    await MediaFile.sync();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const count = await MediaFile.count().catch(() => 0);
    if (count === 0) {
      await MediaFile.bulkCreate(INITIAL_MEDIA).catch((e) => {
        console.warn('Initial media seed notice:', e.message);
      });
    }

    const where = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    let files = await MediaFile.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    if (search) {
      const term = search.toLowerCase();
      files = files.filter(
        (f) =>
          f.originalName?.toLowerCase().includes(term) ||
          f.filename?.toLowerCase().includes(term) ||
          f.category?.toLowerCase().includes(term)
      );
    }

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Media GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    await MediaFile.sync();

    const contentType = request.headers.get('content-type') || '';

    // Handle Multipart Form Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      const category = formData.get('category') || 'GENERAL';

      if (!file || typeof file === 'string') {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const originalExt = path.extname(file.name) || '.png';
      const safeBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_') || 'image';

      let finalBuffer = buffer;
      let finalFileName = `${safeBase}_${Date.now()}${originalExt}`;
      let finalMimeType = file.type || 'image/png';
      let finalOriginalName = file.name;

      const isImage = (file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|gif|bmp|tiff|svg|avif)$/i.test(file.name);

      if (isImage) {
        try {
          const sharpModule = await import('sharp');
          const sharp = sharpModule.default || sharpModule;

          // Convert to highly optimized WebP format
          finalBuffer = await sharp(buffer)
            .rotate() // Auto-orient images from phone cameras (EXIF orientation)
            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();

          finalFileName = `${safeBase}_${Date.now()}.webp`;
          finalMimeType = 'image/webp';
          finalOriginalName = `${safeBase}.webp`;
        } catch (sharpError) {
          console.warn('Sharp WebP conversion fallback:', sharpError.message);
          // Fallback to original buffer if sharp encounters SVG or uncompressed custom format
          finalBuffer = buffer;
          finalFileName = `${safeBase}_${Date.now()}${originalExt}`;
          finalMimeType = file.type || 'image/png';
        }
      }

      const filePath = path.join(uploadsDir, finalFileName);
      await fs.writeFile(filePath, finalBuffer);

      const publicUrl = `/uploads/${finalFileName}`;

      const media = await MediaFile.create({
        filename: finalFileName,
        originalName: finalOriginalName,
        url: publicUrl,
        fileType: finalMimeType,
        fileSize: finalBuffer.length,
        category,
      });

      return NextResponse.json({ success: true, file: media, url: publicUrl }, { status: 201 });
    }

    // Handle JSON direct URL registration
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const media = await MediaFile.create({
      filename: body.filename || `link_${Date.now()}.webp`,
      originalName: body.originalName || body.filename || 'Custom Image Link',
      url: body.url,
      fileType: body.fileType || 'image/webp',
      fileSize: body.fileSize || 0,
      category: body.category || 'GENERAL',
    });

    return NextResponse.json({ success: true, file: media, url: body.url }, { status: 201 });
  } catch (error) {
    console.error('Media POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
