import { NextResponse } from 'next/server';
import {
  initDb,
  ImmigrationRecord,
  Employee,
  VisaType,
} from '@/lib/db/models/index';

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const record = await ImmigrationRecord.findByPk(id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: VisaType, as: 'visaType' },
      ],
    });

    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
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

    const record = await ImmigrationRecord.findByPk(id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    if (!body.employeeId && !record.employeeId) {
      return NextResponse.json({ success: false, error: 'Employee is mandatory.' }, { status: 400 });
    }

    const expiryDate = body.visaExpiryDate || body.expiryDate || record.expiryDate;
    if (!expiryDate) {
      return NextResponse.json({ success: false, error: 'Visa Expiry Date is mandatory.' }, { status: 400 });
    }

    const payload = {
      employeeId: body.employeeId ? parseInt(body.employeeId, 10) : record.employeeId,
      visaTypeId: body.visaTypeId ? parseInt(body.visaTypeId, 10) : null,
      nationality: body.nationality !== undefined ? (body.nationality?.trim() || null) : record.nationality,
      niNumber: body.niNumber !== undefined ? (body.niNumber?.trim() || null) : record.niNumber,
      passportNumber: body.passportNumber !== undefined ? (body.passportNumber?.trim() || null) : record.passportNumber,
      passportExpiryDate: body.passportExpiryDate || null,
      brpOrEvisaNumber: body.brpOrEvisaNumber || body.brpNumber || null,
      visaStartDate: body.visaStartDate || body.issueDate || null,
      visaExpiryDate: expiryDate,
      issueDate: body.issueDate || body.visaStartDate || null,
      expiryDate: expiryDate,
      sponsorLicenceNo: body.sponsorLicenceNo !== undefined ? (body.sponsorLicenceNo?.trim() || null) : record.sponsorLicenceNo,
      sponsorCosNumber: body.sponsorCosNumber || body.cosNumber || null,
      cosNumber: body.cosNumber || body.sponsorCosNumber || null,
      isSkilledWorkerEligible: body.isSkilledWorkerEligible !== undefined ? Boolean(body.isSkilledWorkerEligible) : record.isSkilledWorkerEligible,
      offeredSalary: body.offeredSalary !== undefined && body.offeredSalary !== '' && body.offeredSalary != null ? parseFloat(body.offeredSalary) : 0,
      salaryMeetsThreshold: body.salaryMeetsThreshold !== undefined ? Boolean(body.salaryMeetsThreshold) : record.salaryMeetsThreshold,
      rightToWorkStatus: body.rightToWorkStatus || record.rightToWorkStatus || 'Valid',
      notes: body.notes !== undefined ? (body.notes?.trim() || null) : record.notes,
      lastVerifiedDate: body.lastVerifiedDate || null,
      nextReviewDate: body.nextReviewDate || null,
      passportPhoto: body.passportPhoto !== undefined ? body.passportPhoto : record.passportPhoto,
      status: body.status || record.status || 'VALID',
    };

    await record.update(payload);
    const updated = await ImmigrationRecord.findByPk(id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: VisaType, as: 'visaType' },
      ],
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
    const record = await ImmigrationRecord.findByPk(id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    await record.destroy();
    return NextResponse.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
