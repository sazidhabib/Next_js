import { NextResponse } from 'next/server';
import { trackEvent } from '@/app/lib/analytics';
import { rateLimit, getClientIp } from '@/app/lib/middleware';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    if (!rateLimit(`event_${clientIp}`, 50, 60000)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const body = await request.json();
    const { eventType, eventData, pagePath } = body;

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: 'eventType is required' },
        { status: 400 }
      );
    }

    await trackEvent({ eventType, eventData, pagePath, request });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
