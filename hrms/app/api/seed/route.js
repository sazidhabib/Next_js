import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
