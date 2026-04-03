import { NextResponse } from 'next/server';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880;
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

export async function POST(request) {
  try {
    const auth = await authMiddleware(request, 'editor');
    if (!auth.success) return auth;

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const uploadPath = join(process.cwd(), UPLOAD_DIR, 'portfolio');

    await mkdir(uploadPath, { recursive: true });

    const filePath = join(uploadPath, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/portfolio/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Upload');
  }
}
