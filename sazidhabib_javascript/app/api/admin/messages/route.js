import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { ContactMessage, initDb } from '@/lib/models';

export async function GET(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { id, read } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    const msg = await ContactMessage.findByPk(id);
    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await msg.update({ read: !!read });
    return NextResponse.json(msg);
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

    await ContactMessage.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
