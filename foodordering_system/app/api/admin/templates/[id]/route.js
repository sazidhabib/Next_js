import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptSession } from '@/lib/session';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

export async function GET(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const template = await prisma.invoiceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error('Error fetching template details:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch template details' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, fontSize, config } = body;

    const existing = await prisma.invoiceTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    const updated = await prisma.invoiceTemplate.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        fontSize: fontSize !== undefined ? fontSize : existing.fontSize,
        config: config !== undefined ? (typeof config === 'string' ? config : JSON.stringify(config)) : existing.config,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ success: false, error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Check if the template is set as active on any restaurant to prevent broken references
    const activeOnRestaurant = await prisma.restaurant.findFirst({
      where: {
        OR: [
          { activeCustomerTemplateId: id },
          { activeKitchenTemplateId: id }
        ]
      }
    });

    if (activeOnRestaurant) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete template. It is currently set as the active printer template.' 
      }, { status: 400 });
    }

    await prisma.invoiceTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 });
  }
}
