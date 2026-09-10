import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Restaurant, DeliveryZone, ensureDatabaseReady } from '@/lib/sequelize';
import { getAllRestaurants, saveDeliveryZones, updateDeliveryStatus } from '@/lib/dataStore';

export async function GET(request) {
  try {
    await ensureDatabaseReady();
    const { searchParams } = new URL(request.url);
    const slugOrId = searchParams.get('slug') || searchParams.get('restaurantId') || 'bellavista-pizza';

    let restaurant = await Restaurant.findOne({
      where: {
        [Op.or]: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: [
        {
          model: DeliveryZone,
          as: 'deliveryZones',
          required: false,
        },
      ],
    });

    if (!restaurant) {
      restaurant = await Restaurant.findOne({
        include: [
          {
            model: DeliveryZone,
            as: 'deliveryZones',
            required: false,
          },
        ],
      });
    }

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const allStores = await getAllRestaurants();
    const allLocations = (allStores || []).map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      address: s.address,
      city: s.city,
      state: s.state,
      country: s.country,
      lat: s.latitude || 51.5133,
      lng: s.longitude || -0.1362,
    }));

    const rawZones = restaurant.deliveryZones || [];
    const formattedZones = rawZones.map((z) => {
      const plain = typeof z.get === 'function' ? z.get({ plain: true }) : z;
      let polygon = null;
      if (plain.polygonGeoJson) {
        try {
          const parsed = typeof plain.polygonGeoJson === 'string' ? JSON.parse(plain.polygonGeoJson) : plain.polygonGeoJson;
          if (Array.isArray(parsed)) {
            polygon = parsed;
          } else if (parsed && parsed.coordinates && Array.isArray(parsed.coordinates[0])) {
            polygon = parsed.coordinates[0].map(([lng, lat]) => [lat, lng]);
          }
        } catch (e) {
          polygon = null;
        }
      }
      const isShape = plain.zoneType === 'SHAPE' || plain.zoneType === 'POLYGON';
      return {
        id: plain.id,
        name: plain.name,
        zoneType: isShape ? 'SHAPE' : 'CIRCLE',
        radiusKm: plain.radiusKm || 1.0,
        polygon: isShape ? polygon : null,
        postalCodes: plain.postalCodes,
        minOrderAmount: plain.minOrderAmount !== undefined ? plain.minOrderAmount : 15.0,
        deliveryFee: plain.deliveryFee !== undefined ? plain.deliveryFee : 2.5,
        freeDeliveryThreshold: plain.freeDeliveryThreshold !== undefined ? plain.freeDeliveryThreshold : 40.0,
        estimatedTimeMin: plain.estimatedTimeMin || 30,
        isActive: plain.isActive !== undefined ? plain.isActive : true,
        isHidden: plain.isActive === false,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        enableDelivery: restaurant.enableDelivery,
        deliveryZones: formattedZones,
        restaurantLocation: {
          lat: restaurant.latitude || 51.5133,
          lng: restaurant.longitude || -0.1362,
          address: restaurant.address || '42 Dean Street, Soho, London W1D 4PG, UK',
          name: restaurant.name || 'Bella Vista Gourmet Kitchen & Pizzeria',
          slug: restaurant.slug,
          city: restaurant.city,
        },
        allLocations,
        currency: restaurant.currency || 'GBP',
        currencySymbol: restaurant.currencySymbol || '£',
      },
    });
  } catch (error) {
    console.error('Error fetching admin delivery zones:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await ensureDatabaseReady();
    const body = await request.json();
    const { deliveryZones, enableDelivery, slug, restaurantId } = body;

    const slugOrId = slug || restaurantId || 'bellavista-pizza';
    let restaurant = await Restaurant.findOne({
      where: {
        [Op.or]: [{ slug: slugOrId }, { id: slugOrId }],
      },
    });

    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    // Update restaurant delivery enablement
    if (enableDelivery !== undefined) {
      await restaurant.update({ enableDelivery: !!enableDelivery });
      updateDeliveryStatus(enableDelivery);
    }

    // Update delivery zones in MySQL
    if (Array.isArray(deliveryZones)) {
      // Clean up previous zones for this restaurant
      await DeliveryZone.destroy({ where: { restaurantId: restaurant.id } });

      const zonesToInsert = deliveryZones.map((z, idx) => {
        const isShape = z.zoneType === 'SHAPE' || z.zoneType === 'POLYGON';
        let polyStr = null;
        if (isShape && z.polygon) {
          polyStr = typeof z.polygon === 'string' ? z.polygon : JSON.stringify(z.polygon);
        }

        return {
          id: z.id && !String(z.id).startsWith('zone-') && String(z.id).length > 10 ? z.id : undefined,
          restaurantId: restaurant.id,
          name: z.name || `Zone ${idx + 1}`,
          zoneType: isShape ? 'SHAPE' : 'CIRCLE',
          radiusKm: isShape ? null : (parseFloat(z.radiusKm) || 1.0),
          polygonGeoJson: polyStr,
          postalCodes: z.postalCodes || null,
          minOrderAmount: parseFloat(z.minOrderAmount) || 0.0,
          deliveryFee: parseFloat(z.deliveryFee) || 0.0,
          freeDeliveryThreshold: z.freeDeliveryThreshold !== undefined && z.freeDeliveryThreshold !== null ? parseFloat(z.freeDeliveryThreshold) : null,
          estimatedTimeMin: parseInt(z.estimatedTimeMin) || 30,
          isActive: z.isHidden ? false : (z.isActive !== undefined ? !!z.isActive : true),
        };
      });

      const created = await DeliveryZone.bulkCreate(zonesToInsert);

      // Sync memory fallback
      saveDeliveryZones(deliveryZones);

      const formattedSavedZones = created.map((z) => {
        const plain = z.get({ plain: true });
        let polygon = null;
        if (plain.polygonGeoJson) {
          try {
            const parsed = typeof plain.polygonGeoJson === 'string' ? JSON.parse(plain.polygonGeoJson) : plain.polygonGeoJson;
            if (Array.isArray(parsed)) {
              polygon = parsed;
            } else if (parsed && parsed.coordinates && Array.isArray(parsed.coordinates[0])) {
              polygon = parsed.coordinates[0].map(([lng, lat]) => [lat, lng]);
            }
          } catch (e) {
            polygon = null;
          }
        }
        const isShape = plain.zoneType === 'SHAPE' || plain.zoneType === 'POLYGON';
        return {
          id: plain.id,
          name: plain.name,
          zoneType: isShape ? 'SHAPE' : 'CIRCLE',
          radiusKm: plain.radiusKm || 1.0,
          polygon: isShape ? polygon : null,
          postalCodes: plain.postalCodes,
          minOrderAmount: plain.minOrderAmount,
          deliveryFee: plain.deliveryFee,
          freeDeliveryThreshold: plain.freeDeliveryThreshold,
          estimatedTimeMin: plain.estimatedTimeMin,
          isActive: plain.isActive,
          isHidden: plain.isActive === false,
        };
      });

      return NextResponse.json({
        success: true,
        message: 'Delivery zones updated and persisted successfully',
        data: {
          enableDelivery: restaurant.enableDelivery,
          deliveryZones: formattedSavedZones,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        enableDelivery: restaurant.enableDelivery,
      },
    });
  } catch (error) {
    console.error('Error saving admin delivery zones:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
