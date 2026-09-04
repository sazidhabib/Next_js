import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/sequelizeSeed';

export async function POST(request) {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database synced and seeded successfully via Sequelize.' });
  } catch (error) {
    console.error('Seed endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Support GET for direct browser seeding
export async function GET(request) {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database synced and seeded successfully via Sequelize.' });
  } catch (error) {
    console.error('Seed endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
