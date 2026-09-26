import { NextResponse } from 'next/server';
import {
  initDb,
  RightToWork,
  Employee,
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

    const records = await RightToWork.findAll({
      where,
      include: [
        { model: Employee, as: 'employee' },
      ],
      order: [['checkDate', 'DESC']],
    });

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('RTW GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const record = await RightToWork.create(body);
    const fetched = await RightToWork.findByPk(record.id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, record: fetched }, { status: 201 });
  } catch (error) {
    console.error('RTW POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
