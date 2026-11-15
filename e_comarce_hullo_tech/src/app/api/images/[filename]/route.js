import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdmin } from '@/lib/api-auth';

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { filename } = await params;
    // Prevent directory traversal attacks
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '');

    const targets = [
      join(process.cwd(), 'public', 'uploads', safeName),
      join(process.cwd(), 'uploads', safeName)
    ];

    let deleted = false;
    for (const target of targets) {
      if (existsSync(target)) {
        await unlink(target);
        deleted = true;
      }
    }

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
