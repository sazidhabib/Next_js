import { NextResponse } from 'next/server';
import { initDb, MediaFile } from '@/lib/db/models/index';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const media = await MediaFile.findByPk(id);

    if (!media) {
      return NextResponse.json({ success: false, error: 'Media file not found' }, { status: 404 });
    }

    // Try deleting physical file if in /uploads/
    if (media.url && media.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', media.url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('Physical file deletion notice:', err.message);
      }
    }

    await media.destroy();
    return NextResponse.json({ success: true, message: 'Media file deleted' });
  } catch (error) {
    console.error('Media DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
