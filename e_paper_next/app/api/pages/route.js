import { NextResponse } from 'next/server';
import { savePage } from '@/lib/epaper-service';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }
    const saved = await savePage(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
