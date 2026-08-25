import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptSession } from '@/lib/session';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

export async function GET(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    const templates = await prisma.invoiceTemplate.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId, name, type, fontSize, config } = body;

    if (!restaurantId || !name || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const template = await prisma.invoiceTemplate.create({
      data: {
        restaurantId,
        name,
        type,
        fontSize: fontSize || 12,
        config: typeof config === 'string' ? config : JSON.stringify(config),
      },
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 });
  }
}
