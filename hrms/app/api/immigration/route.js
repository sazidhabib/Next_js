import { NextResponse } from 'next/server';
import {
  initDb,
  ImmigrationRecord,
  Employee,
  VisaType,
} from '@/lib/db/models/index';
import { requirePermission } from '@/lib/auth/rbac';

export async function GET(request) {
  try {
    const auth = await requirePermission(request, { section: 'immigration', action: 'VIEW' });
    if (!auth.authorized) return auth.response;

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
      order: [['id', 'DESC']],
    });

    const maxId = await ImmigrationRecord.max('id');
    const nextId = (maxId || 0) + 1;

    return NextResponse.json({ success: true, records, nextId });
  } catch (error) {
    console.error('Immigration GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requirePermission(request, { section: 'immigration', action: 'EDIT' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const body = await request.json();

    if (!body.employeeId) {
      return NextResponse.json({ success: false, error: 'Employee is mandatory.' }, { status: 400 });
    }
    const expiryDate = body.visaExpiryDate || body.expiryDate;
    if (!expiryDate) {
      return NextResponse.json({ success: false, error: 'Visa Expiry Date is mandatory.' }, { status: 400 });
    }

    const payload = {
      employeeId: parseInt(body.employeeId, 10),
      visaTypeId: body.visaTypeId ? parseInt(body.visaTypeId, 10) : null,
      nationality: body.nationality?.trim() || null,
      niNumber: body.niNumber?.trim() || null,
      passportNumber: body.passportNumber?.trim() || null,
      passportExpiryDate: body.passportExpiryDate || null,
      brpOrEvisaNumber: body.brpOrEvisaNumber || body.brpNumber || null,
      visaStartDate: body.visaStartDate || body.issueDate || null,
      visaExpiryDate: expiryDate,
      issueDate: body.issueDate || body.visaStartDate || null,
      expiryDate: expiryDate,
      sponsorLicenceNo: body.sponsorLicenceNo?.trim() || null,
      sponsorCosNumber: body.sponsorCosNumber || body.cosNumber || null,
      cosNumber: body.cosNumber || body.sponsorCosNumber || null,
      isSkilledWorkerEligible: Boolean(body.isSkilledWorkerEligible),
      offeredSalary: body.offeredSalary !== '' && body.offeredSalary != null ? parseFloat(body.offeredSalary) : 0,
      salaryMeetsThreshold: Boolean(body.salaryMeetsThreshold),
      rightToWorkStatus: body.rightToWorkStatus || 'Valid',
      shareCode: body.shareCode ? body.shareCode.trim().toUpperCase() : null,
      shareCodeExpiryDate: body.shareCodeExpiryDate || null,
      notes: body.notes?.trim() || null,
      lastVerifiedDate: body.lastVerifiedDate || null,
      nextReviewDate: body.nextReviewDate || null,
      passportPhoto: body.passportPhoto || null,
      documentUrl: body.documentUrl || null,
      status: body.status || 'VALID',
    };

    const record = await ImmigrationRecord.create(payload);

    // Keep corresponding Employee record in sync with share code and expiry date
    if (payload.employeeId && (body.shareCode !== undefined || body.shareCodeExpiryDate !== undefined)) {
      const empUpdate = {};
      if (body.shareCode !== undefined) empUpdate.shareCode = payload.shareCode;
      if (body.shareCodeExpiryDate !== undefined) empUpdate.shareCodeExpiryDate = payload.shareCodeExpiryDate;
      await Employee.update(empUpdate, { where: { id: payload.employeeId } });
    }
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
