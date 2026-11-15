import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadDirs = [
      join(process.cwd(), 'public', 'uploads'),
      join(process.cwd(), 'uploads')
    ];

    const imageMap = new Map();

    for (const dir of uploadDirs) {
      if (!existsSync(dir)) continue;
      try {
        const files = await readdir(dir);
        for (const file of files) {
          if (!imageMap.has(file)) {
            const filePath = join(dir, file);
            const fileStat = await stat(filePath);
            if (fileStat.isFile()) {
              imageMap.set(file, {
                name: file,
                url: `/uploads/${file}`,
                size: fileStat.size,
                createdAt: fileStat.birthtime || fileStat.mtime
              });
            }
          }
        }
      } catch (dirErr) {
        console.warn('⚠️ Could not read directory:', dir, dirErr.message);
      }
    }

    const images = Array.from(imageMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Images GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
