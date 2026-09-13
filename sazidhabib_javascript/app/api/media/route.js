import { NextResponse } from 'next/server';
import { Media, initDb } from '@/lib/models';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');

    if (!id && !name) {
      return NextResponse.json({ error: 'Missing id or name parameter' }, { status: 400 });
    }

    await initDb();

    // 1. Try to find in Database
    let media = null;
    if (id) {
      media = await Media.findByPk(id);
    }
    if (!media && name) {
      media = await Media.findOne({ where: { name } });
    }

    if (media && media.data) {
      const dataStr = media.data;

      // Handle Data URL (e.g. data:image/webp;base64,...)
      if (dataStr.startsWith('data:')) {
        const matches = dataStr.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          return new Response(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }

      // If data is a local static path
      if (dataStr.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', dataStr.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          const fileBuffer = fs.readFileSync(localPath);
          const ext = path.extname(localPath).toLowerCase().replace('.', '');
          const mimeMap = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            webp: 'image/webp',
            svg: 'image/svg+xml',
            gif: 'image/gif',
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg',
          };
          const contentType = mimeMap[ext] || 'application/octet-stream';

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': fileBuffer.length.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    }

    // 2. Fallback: check public folder directly for the requested name
    if (name) {
      const searchDirs = [
        path.join(process.cwd(), 'public', 'src', 'assets'),
        path.join(process.cwd(), 'public', 'src', 'assets', 'tech'),
        path.join(process.cwd(), 'public', 'planet'),
        path.join(process.cwd(), 'public'),
      ];

      for (const dir of searchDirs) {
        const filePath = path.join(dir, name);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const ext = path.extname(filePath).toLowerCase().replace('.', '');
          const mimeMap = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            webp: 'image/webp',
            svg: 'image/svg+xml',
            gif: 'image/gif',
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg',
          };
          const contentType = mimeMap[ext] || 'application/octet-stream';

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': fileBuffer.length.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    }

    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  } catch (error) {
    console.error('Error in /api/media:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
