import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { InvoiceTemplate, Restaurant } from '@/lib/sequelize';
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
    let restaurantIdParam = searchParams.get('restaurantId');
    
    // Find matching restaurant by ID or slug, or fallback to first restaurant in database
    let targetRestaurant = null;
    if (restaurantIdParam && restaurantIdParam !== 'undefined' && restaurantIdParam !== 'null') {
      targetRestaurant = await Restaurant.findOne({
        where: {
          [Op.or]: [{ id: restaurantIdParam }, { slug: restaurantIdParam }],
        },
      });
    }

    if (!targetRestaurant) {
      targetRestaurant = await Restaurant.findOne();
    }

    if (!targetRestaurant) {
      return NextResponse.json({ success: true, data: [] });
    }

    const restaurantId = targetRestaurant.id;

    let templates = await InvoiceTemplate.findAll({
      where: { restaurantId },
      order: [['createdAt', 'DESC']],
    });

    const hasAnupamCustomer = templates.some((t) => {
      try {
        const c = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
        return c?.layoutStyle === 'anupam_classic' || t.name.includes('Anupam Classic');
      } catch (e) {
        return false;
      }
    });

    const hasStandardCustomer = templates.some((t) => {
      try {
        const c = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
        return (c?.layoutStyle === 'standard' || !c?.layoutStyle) && t.type === 'CUSTOMER';
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

    const hasStandardKitchen = templates.some((t) => {
      try {
        const c = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
        return (c?.layoutStyle === 'standard' || !c?.layoutStyle) && t.type === 'KITCHEN';
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

    if (!hasStandardCustomer) {
      await InvoiceTemplate.create({
        restaurantId,
        name: 'Standard Boxed Client Receipt',
        type: 'CUSTOMER',
        fontSize: 12,
        config: JSON.stringify({
          layoutStyle: 'standard',
          paymentMethod: true,
          time: true,
          estimatedDriveTime: true,
          direction: true,
          onPremiseNumber: true,
          orderDetails: true,
          clientInfo: true,
          clientComment: true,
          items: true,
          isPaid: true,
          orderOnline: true,
          contactDetails: true,
          infoBox1: true,
          infoBox2: false,
          infoBox3: false,
          clientConfirmation: false,
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

    if (!hasStandardKitchen) {
      await InvoiceTemplate.create({
        restaurantId,
        name: 'Standard Kitchen Prep Ticket',
        type: 'KITCHEN',
        fontSize: 12,
        config: JSON.stringify({
          layoutStyle: 'standard',
          header: true,
          onPremiseNumber: true,
          orderDetails: true,
          clientComment: true,
          items: true,
          isPaid: true,
          packagingStationQualityControl: false,
          previewOptions: true,
          ticketHolderSpace: true,
        }),
      });
      newTemplatesCreated = true;
    }

    if (newTemplatesCreated || templates.length === 0) {
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
    const { restaurantId: rawRestoId, name, type, fontSize, config } = body;

    if (!name || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let targetRestaurant = null;
    if (rawRestoId) {
      targetRestaurant = await Restaurant.findOne({
        where: {
          [Op.or]: [{ id: rawRestoId }, { slug: rawRestoId }],
        },
      });
    }

    if (!targetRestaurant) {
      targetRestaurant = await Restaurant.findOne();
    }

    if (!targetRestaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const template = await InvoiceTemplate.create({
      restaurantId: targetRestaurant.id,
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
