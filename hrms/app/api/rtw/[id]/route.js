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

    const payload = {
      ...body,
      checkMethod: body.checkMethod || body.checkType || record.checkMethod,
      checkType: body.checkType || body.checkMethod || record.checkType,
      documentRef: body.documentRef !== undefined ? body.documentRef : body.documentRefNumber || record.documentRef,
      documentRefNumber: body.documentRefNumber !== undefined ? body.documentRefNumber : body.documentRef || record.documentRefNumber,
      performedByUserId: body.performedByUserId || body.verifiedBy || record.performedByUserId,
      verifiedBy: body.verifiedBy || body.performedByUserId || record.verifiedBy,
      nextReviewDate: body.followUpDate !== undefined ? body.followUpDate : body.nextReviewDate || record.nextReviewDate,
      followUpDate: body.followUpDate !== undefined ? body.followUpDate : body.nextReviewDate || record.followUpDate,
    };

    await record.update(payload);
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
