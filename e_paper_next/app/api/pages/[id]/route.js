import { NextResponse } from 'next/server';
import { deletePage } from '@/lib/epaper-service';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deletePage(id);
    return NextResponse.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
