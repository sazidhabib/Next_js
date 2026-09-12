import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Media, initDb } from '@/lib/models';

export async function GET(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const mediaList = await Media.findAll({
      attributes: ['id', 'name', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    return NextResponse.json(mediaList);
  } catch (error) {
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

    return NextResponse.json({ id: newMedia.id, name: newMedia.name, createdAt: newMedia.createdAt }, { status: 201 });
  } catch (error) {
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

    await Media.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
