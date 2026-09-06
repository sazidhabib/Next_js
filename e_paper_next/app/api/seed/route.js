import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/epaper-service';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
