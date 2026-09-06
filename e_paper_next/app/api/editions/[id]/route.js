import { NextResponse } from 'next/server';
import { getEditionById } from '@/lib/epaper-service';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const edition = await getEditionById(id);
    if (!edition) {
      return NextResponse.json({ success: false, error: 'Edition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: edition });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
