import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Media, initDb } from '@/lib/models';
import fs from 'fs';
import path from 'path';

function scanLocalAssets() {
  const assets = [];
  const publicDir = path.join(process.cwd(), 'public');

  const scanDirs = [
    { dir: path.join(publicDir, 'src', 'assets'), prefix: '/src/assets', category: 'Projects & UI' },
    { dir: path.join(publicDir, 'src', 'assets', 'tech'), prefix: '/src/assets/tech', category: 'Tech Icons' },
    { dir: path.join(publicDir, 'planet'), prefix: '/planet', category: '3D & Other' },
  ];

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp4', '.webm'];

  for (const item of scanDirs) {
    if (fs.existsSync(item.dir)) {
      const files = fs.readdirSync(item.dir);
      for (const file of files) {
        const fullPath = path.join(item.dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (allowedExtensions.includes(ext)) {
            const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);
            assets.push({
              id: `local_${Buffer.from(`${item.prefix}/${file}`).toString('base64').replace(/=/g, '')}`,
              name: file,
              url: `${item.prefix}/${file}`,
              type: isVideo ? 'video' : 'image',
              category: item.category,
              isLocal: true,
              sizeBytes: stat.size,
              createdAt: stat.mtime.toISOString(),
            });
          }
        }
      }
    }
  }

  return assets;
}

export async function GET(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    
    // 1. Fetch custom uploaded media from DB
    const dbMediaList = await Media.findAll({
      attributes: ['id', 'name', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const dbItems = dbMediaList.map(item => {
      const ext = path.extname(item.name || '').toLowerCase();
      const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);
      return {
        id: item.id,
        name: item.name,
        url: `/api/media?id=${item.id}&name=${encodeURIComponent(item.name)}`,
        type: isVideo ? 'video' : 'image',
        category: 'Custom Uploads',
        isLocal: false,
        createdAt: item.createdAt,
      };
    });

    // 2. Scan project assets
    const localItems = scanLocalAssets();

    // 3. Combine: Custom uploads first, followed by local project assets
    const allMedia = [...dbItems, ...localItems];

    return NextResponse.json(allMedia);
  } catch (error) {
    console.error('Error fetching media in admin route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { name, data } = await request.json();

    if (!name || !data) {
      return NextResponse.json({ error: 'Missing required fields: name, data' }, { status: 400 });
    }

    const newMedia = await Media.create({
      name,
      data,
    });

    const ext = path.extname(newMedia.name || '').toLowerCase();
    const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);

    return NextResponse.json({
      id: newMedia.id,
      name: newMedia.name,
      url: `/api/media?id=${newMedia.id}&name=${encodeURIComponent(newMedia.name)}`,
      type: isVideo ? 'video' : 'image',
      category: 'Custom Uploads',
      isLocal: false,
      createdAt: newMedia.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
    }

    // Local static files are read-only from the project folder
    if (id.startsWith('local_')) {
      return NextResponse.json({ error: 'Built-in project assets cannot be deleted from the admin panel.' }, { status: 400 });
    }

    await Media.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
