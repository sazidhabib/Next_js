import { NextResponse } from 'next/server';
import { saveArticle } from '@/lib/epaper-service';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content || !body.editionId) {
      return NextResponse.json({ success: false, error: 'Missing required article fields' }, { status: 400 });
    }
    const saved = await saveArticle(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
