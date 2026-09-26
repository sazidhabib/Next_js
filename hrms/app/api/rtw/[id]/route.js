import { NextResponse } from 'next/server';
import {
  initDb,
  RightToWork,
  Employee,
} from '@/lib/db/models/index';

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const record = await RightToWork.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!record) {
      return NextResponse.json({ success: false, error: 'RTW record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const record = await RightToWork.findByPk(id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'RTW record not found' }, { status: 404 });
    }

    await record.update(body);
    const updated = await RightToWork.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const record = await RightToWork.findByPk(id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'RTW record not found' }, { status: 404 });
    }

    await record.destroy();
    return NextResponse.json({ success: true, message: 'RTW record deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
