import { NextResponse } from 'next/server';
import { saveHotspot } from '@/lib/epaper-service';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.pageId || !body.articleId) {
      return NextResponse.json({ success: false, error: 'Missing pageId or articleId' }, { status: 400 });
    }
    const saved = await saveHotspot(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
