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

    const maxId = await RightToWork.max('id');
    const nextId = (maxId || 0) + 1;

    return NextResponse.json({ success: true, records, nextId });
  } catch (error) {
    console.error('RTW GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    if (!body.employeeId) {
      return NextResponse.json({ success: false, error: 'Employee is mandatory.' }, { status: 400 });
    }
    if (!body.checkDate) {
      return NextResponse.json({ success: false, error: 'Check Date is mandatory.' }, { status: 400 });
    }

    const payload = {
      employeeId: parseInt(body.employeeId, 10),
      checkDate: body.checkDate,
      checkMethod: body.checkMethod || body.checkType || 'Online Home Office Share Code Check',
      checkType: body.checkType || body.checkMethod || 'ONLINE_SHARE_CODE',
      documentType: body.documentType || 'Passport',
      documentRef: body.documentRef?.trim() || body.documentRefNumber?.trim() || null,
      documentRefNumber: body.documentRefNumber?.trim() || body.documentRef?.trim() || null,
      performedByUserId: body.performedByUserId?.trim() || body.verifiedBy?.trim() || null,
      verifiedBy: body.verifiedBy?.trim() || body.performedByUserId?.trim() || null,
      outcome: body.outcome || 'Continuous Right to Work',
      followUpRequired: Boolean(body.followUpRequired),
      followUpDate: body.followUpRequired && body.followUpDate ? body.followUpDate : null,
      nextReviewDate: body.followUpRequired && (body.nextReviewDate || body.followUpDate) ? (body.nextReviewDate || body.followUpDate) : null,
      notes: body.notes?.trim() || null,
      statutoryExcuseGranted: body.outcome !== 'No Right to Work',
      status: body.status || 'VERIFIED',
    };
    delete payload.id;

    const record = await RightToWork.create(payload);
    const fetched = await RightToWork.findByPk(record.id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, record: fetched }, { status: 201 });
  } catch (error) {
    console.error('RTW POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
