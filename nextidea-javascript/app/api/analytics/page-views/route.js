import { NextResponse } from 'next/server';
import { trackPageView } from '@/app/lib/analytics';
import { rateLimit, getClientIp } from '@/app/lib/middleware';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    if (!rateLimit(`pageview_${clientIp}`, 100, 60000)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const body = await request.json();
    const { pagePath, pageTitle, referrer } = body;

    if (!pagePath) {
      return NextResponse.json(
        { success: false, error: 'pagePath is required' },
        { status: 400 }
      );
    }

    await trackPageView({ pagePath, pageTitle, referrer, request });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page view tracking error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
