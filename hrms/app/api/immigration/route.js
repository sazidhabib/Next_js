import { NextResponse } from 'next/server';
import {
  initDb,
  ImmigrationRecord,
  Employee,
  VisaType,
} from '@/lib/db/models/index';

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const records = await ImmigrationRecord.findAll({
      where,
      include: [
        { model: Employee, as: 'employee' },
        { model: VisaType, as: 'visaType' },
      ],
      order: [['expiryDate', 'ASC']],
    });

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Immigration GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const record = await ImmigrationRecord.create(body);
    const fetched = await ImmigrationRecord.findByPk(record.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: VisaType, as: 'visaType' },
      ],
    });

    return NextResponse.json({ success: true, record: fetched }, { status: 201 });
  } catch (error) {
    console.error('Immigration POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
