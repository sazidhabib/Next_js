import { NextResponse } from 'next/server';
import { getEditionsList } from '@/lib/epaper-service';

export async function GET() {
  try {
    const editions = await getEditionsList();
    return NextResponse.json({ success: true, data: editions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
