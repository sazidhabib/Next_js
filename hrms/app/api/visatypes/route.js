import { NextResponse } from 'next/server';
import { initDb, VisaType, ImmigrationRecord } from '@/lib/db/models/index';

export async function GET() {
  try {
    await initDb();
    const visaTypes = await VisaType.findAll({
      include: [{ model: ImmigrationRecord, as: 'records', attributes: ['id'] }],
      order: [['name', 'ASC']],
    });
    return NextResponse.json({ success: true, visaTypes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const visaType = await VisaType.create(body);
    return NextResponse.json({ success: true, visaType }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
