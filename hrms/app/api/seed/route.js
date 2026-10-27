import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';
import { getAuthSession } from '@/lib/auth/rbac';

async function handleSeed(request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'Database seeding endpoint is disabled in production environments for security.' },
      { status: 403 }
    );
  }

  const session = await getAuthSession(request);
  const isSuperAdmin =
    session?.id === 'system-superadmin' || session?.roleName === 'Super Admin' || session?.isSuperAdmin;

  if (!isSuperAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Super Administrator privileges required to reseed database.' },
      { status: 403 }
    );
  }

  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  return handleSeed(request);
}

export async function POST(request) {
  return handleSeed(request);
}

