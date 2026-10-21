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

    // Calculate next employee code
    const allEmps = await Employee.findAll({ attributes: ['employeeCode', 'id'] });
    let maxNum = 0;
    for (const emp of allEmps) {
      const match = emp.employeeCode?.match(/EMP-(\d+)/i) || emp.employeeCode?.match(/(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      } else if (emp.id && !isNaN(emp.id) && emp.id > maxNum) {
        maxNum = emp.id;
      }
    }
    const nextEmployeeCode = `EMP-${String(maxNum + 1).padStart(3, '0')}`;

    return NextResponse.json({ success: true, employees, nextEmployeeCode });
  } catch (error) {
    console.error('Employees GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    // Validate mandatory fields
    if (
      !body.firstName?.trim() ||
      !body.lastName?.trim() ||
      !body.email?.trim() ||
      !body.phone?.trim() ||
      !body.dateOfBirth
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'First Name, Last Name, Email, Phone No, and Date Of Birth are mandatory.',
        },
        { status: 400 }
      );
    }

    // Auto-generate employee code if missing
    if (!body.employeeCode) {
      const allEmps = await Employee.findAll({ attributes: ['employeeCode', 'id'] });
      let maxNum = 0;
      for (const emp of allEmps) {
        const match = emp.employeeCode?.match(/EMP-(\d+)/i) || emp.employeeCode?.match(/(\d+)/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        } else if (emp.id && !isNaN(emp.id) && emp.id > maxNum) {
          maxNum = emp.id;
        }
      }
      body.employeeCode = `EMP-${String(maxNum + 1).padStart(3, '0')}`;
    }

    // Clean optional fields
    body.firstName = body.firstName.trim();
    body.lastName = body.lastName.trim();
    body.email = body.email.trim();
    body.phone = body.phone.trim();
    body.jobTitle = body.jobTitle?.trim() || null;
    body.departmentId = body.departmentId ? Number(body.departmentId) : null;
    body.hireDate = body.hireDate || null;
    body.startDate = body.startDate || null;
    body.endDate = body.endDate || null;
    body.salary = body.salary !== '' && body.salary != null ? parseFloat(body.salary) : 0;
    body.weeklyHours = body.weeklyHours !== '' && body.weeklyHours != null ? parseFloat(body.weeklyHours) : 37.5;
    body.holidayAllowance = body.holidayAllowance !== '' && body.holidayAllowance != null ? parseFloat(body.holidayAllowance) : 28.0;

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
