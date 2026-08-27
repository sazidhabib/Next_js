import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { InvoiceTemplate, Restaurant } from '@/lib/sequelize';
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
    const template = await InvoiceTemplate.findOne({
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

    const existing = await InvoiceTemplate.findOne({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    await InvoiceTemplate.update({
      name: name !== undefined ? name : existing.name,
      fontSize: fontSize !== undefined ? fontSize : existing.fontSize,
      config: config !== undefined ? (typeof config === 'string' ? config : JSON.stringify(config)) : existing.config,
    }, {
      where: { id },
    });

    const updated = await InvoiceTemplate.findOne({ where: { id } });

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
    const activeOnRestaurant = await Restaurant.findOne({
      where: {
        [Op.or]: [
          { activeCustomerTemplateId: id },
          { activeKitchenTemplateId: id },
        ],
      },
    });

    if (activeOnRestaurant) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete template. It is currently set as the active printer template.' 
      }, { status: 400 });
    }

    await InvoiceTemplate.destroy({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 });
  }
}
