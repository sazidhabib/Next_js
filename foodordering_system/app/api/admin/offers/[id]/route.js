import { NextResponse } from 'next/server';
import { decryptSession } from '@/lib/session';
import { getOfferById, updateOffer, deleteOffer } from '@/lib/dataStore';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

// GET /api/admin/offers/[id]
export async function GET(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const offer = await getOfferById(id);
    if (!offer) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    console.error('Error getting offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/offers/[id]
export async function PUT(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateOffer(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Offer not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/offers/[id]
export async function DELETE(request, { params }) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteOffer(id);

    return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
