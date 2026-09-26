import { NextResponse } from 'next/server';
import { initDb, VisaType } from '@/lib/db/models/index';

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    const visaType = await VisaType.findByPk(id);
    if (!visaType) return NextResponse.json({ success: false, error: 'VisaType not found' }, { status: 404 });
    await visaType.update(body);
    return NextResponse.json({ success: true, visaType });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const visaType = await VisaType.findByPk(id);
    if (!visaType) return NextResponse.json({ success: false, error: 'VisaType not found' }, { status: 404 });
    await visaType.destroy();
    return NextResponse.json({ success: true, message: 'VisaType deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
