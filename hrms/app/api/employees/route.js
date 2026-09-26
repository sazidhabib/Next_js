import { NextResponse } from 'next/server';
import {
  initDb,
  Employee,
  Department,
  ImmigrationRecord,
  RightToWork,
  VisaType,
} from '@/lib/db/models/index';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const isSponsored = searchParams.get('isSponsored');

    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { employeeCode: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { jobTitle: { [Op.like]: `%${search}%` } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (status) {
      where.status = status;
    }

    if (isSponsored !== null && isSponsored !== undefined && isSponsored !== '') {
      where.isSponsoredWorker = isSponsored === 'true';
    }

    const employees = await Employee.findAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
        {
          model: ImmigrationRecord,
          as: 'immigrationRecords',
          include: [{ model: VisaType, as: 'visaType' }],
        },
        { model: RightToWork, as: 'rtwChecks' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ success: true, employees });
  } catch (error) {
    console.error('Employees GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    // Auto-generate employee code if missing
    if (!body.employeeCode) {
      const count = await Employee.count();
      body.employeeCode = `EMP-${String(count + 1).padStart(3, '0')}`;
    }

    const newEmployee = await Employee.create(body);

    // If sponsored or visa info included, optionally create immigration record
    if (body.visaTypeId && body.visaExpiryDate) {
      await ImmigrationRecord.create({
        employeeId: newEmployee.id,
        visaTypeId: body.visaTypeId,
        passportNumber: body.passportNumber || '',
        brpOrEvisaNumber: body.brpOrEvisaNumber || '',
        issueDate: body.visaIssueDate || null,
        expiryDate: body.visaExpiryDate,
        shareCode: body.shareCode || '',
        sponsorCosNumber: body.sponsorCosNumber || '',
        status: 'VALID',
      });
    }

    // If RTW check date included, create initial RTW record
    if (body.rtwCheckDate) {
      await RightToWork.create({
        employeeId: newEmployee.id,
        checkType: body.rtwCheckType || 'ONLINE_SHARE_CODE',
        checkDate: body.rtwCheckDate,
        nextReviewDate: body.rtwNextReviewDate || body.visaExpiryDate || null,
        verifiedBy: body.rtwVerifiedBy || 'HR Admin',
        documentType: body.rtwDocumentType || 'Share Code / Passport',
        documentRefNumber: body.shareCode || body.passportNumber || '',
        statutoryExcuseGranted: true,
        status: 'VERIFIED',
      });
    }

    const fetched = await Employee.findByPk(newEmployee.id, {
      include: [
        { model: Department, as: 'department' },
        { model: ImmigrationRecord, as: 'immigrationRecords', include: [{ model: VisaType, as: 'visaType' }] },
        { model: RightToWork, as: 'rtwChecks' },
      ],
    });

    return NextResponse.json({ success: true, employee: fetched }, { status: 201 });
  } catch (error) {
    console.error('Employees POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
