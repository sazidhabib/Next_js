import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/app/lib/analytics';
import { authMiddleware } from '@/app/lib/middleware';

export async function GET(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const stats = await getDashboardStats();

    if (!stats.success) {
      return NextResponse.json(stats, { status: 500 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
