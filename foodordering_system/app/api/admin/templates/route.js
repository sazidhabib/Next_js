import { NextResponse } from 'next/server';
import { InvoiceTemplate } from '@/lib/sequelize';
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

    let templates = await InvoiceTemplate.findAll({
      where: { restaurantId },
      order: [['createdAt', 'DESC']],
    });

    // Auto-seed missing default templates if restaurant has fewer than 4 templates
    const hasAnupamCustomer = templates.some((t) => {
      try {
        const c = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
        return c?.layoutStyle === 'anupam_classic' || t.name.includes('Anupam Classic');
      } catch (e) {
        return false;
      }
    });

    const hasAnupamKitchen = templates.some((t) => {
      try {
        const c = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
        return c?.layoutStyle === 'anupam_course_grouped' || t.name.includes('Anupam Kitchen');
      } catch (e) {
        return false;
      }
    });

    let newTemplatesCreated = false;

    if (!hasAnupamCustomer) {
      await InvoiceTemplate.create({
        restaurantId,
        name: 'Anupam Classic Client Bill',
        type: 'CUSTOMER',
        fontSize: 12,
        config: JSON.stringify({
          layoutStyle: 'anupam_classic',
          restaurantBrand: 'anupam',
          brandFontSize: 24,
          legalName: 'Sweet Paan Ltd',
          address: '85 Church Street\nGreat Malvern WR14 2AE',
          phone: '01684 573814',
          vatNumber: '240 6873 06',
          businessInfoFontSize: 11,
          tableNumber: '24/2',
          tableFontSize: 16,
          dateFontSize: 11,
          dateTime: true,
          items: true,
          itemsFontSize: 12,
          miscAmount: '0.00',
          subTotal: true,
          total: true,
          totalsFontSize: 12,
          splitBill: true,
          splitWays: 2,
          splitBillFontSize: 12,
          serviceChargeNote: true,
          serviceChargeText: 'Service Charge Not Included',
          serviceChargeFontSize: 12,
          thankYouNote: true,
          thankYouText: 'Thank You For Your Custom\nPlease Call Again',
          thankYouFontSize: 11,
          website: 'www.anupam.co.uk',
          websiteFontSize: 13,
        }),
      });
      newTemplatesCreated = true;
    }

    if (!hasAnupamKitchen) {
      await InvoiceTemplate.create({
        restaurantId,
        name: 'Anupam Kitchen Order Ticket',
        type: 'KITCHEN',
        fontSize: 12,
        config: JSON.stringify({
          layoutStyle: 'anupam_course_grouped',
          headerTitle: 'Kitchen Copy',
          headerFontSize: 13,
          ticketNumber: '73',
          ticketNumberFontSize: 30,
          groupByCategory: true,
          categoryFontSize: 14,
          subCategoryTitle: 'Bread',
          subCategoryFontSize: 13,
          items: true,
          itemsFontSize: 12,
          specialSection: '** Tandoori Items **',
          specialSectionFontSize: 13,
          tableNumber: '24/2',
          tableFooterFontSize: 24,
          dateFooterFontSize: 11,
          dateTime: true,
        }),
      });
      newTemplatesCreated = true;
    }

    if (newTemplatesCreated) {
      templates = await InvoiceTemplate.findAll({
        where: { restaurantId },
        order: [['createdAt', 'DESC']],
      });
    }

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

    const template = await InvoiceTemplate.create({
      restaurantId,
      name,
      type,
      fontSize: fontSize || 12,
      config: typeof config === 'string' ? config : JSON.stringify(config),
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 });
  }
}
