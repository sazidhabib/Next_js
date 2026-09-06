import { NextResponse } from 'next/server';
import { deleteHotspot, saveHotspot } from '@/lib/epaper-service';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteHotspot(id);
    return NextResponse.json({ success: true, message: 'Hotspot deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const saved = await saveHotspot({ ...body, id: parseInt(id, 10) });
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
