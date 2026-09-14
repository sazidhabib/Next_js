import { NextResponse } from 'next/server';
import { getEditionsList, saveEdition } from '@/lib/epaper-service';

export async function GET() {
  try {
    const editions = await getEditionsList();
    return NextResponse.json({ success: true, data: editions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.publishDate) {
      return NextResponse.json({ success: false, error: 'Title and publish date are required' }, { status: 400 });
    }
    const saved = await saveEdition(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
