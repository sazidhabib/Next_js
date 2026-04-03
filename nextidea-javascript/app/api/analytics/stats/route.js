import { NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/app/lib/analytics';
import { authMiddleware } from '@/app/lib/middleware';

export async function GET(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const stats = await getAnalyticsStats(period, startDate, endDate);

    if (!stats.success) {
      return NextResponse.json(stats, { status: 500 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
