import { NextResponse } from 'next/server';
import {
  initDb,
  Employee,
  Department,
  ImmigrationRecord,
  RightToWork,
  VisaType,
  LeaveRequest,
  User,
} from '@/lib/db/models/index';
import { requirePermission } from '@/lib/auth/rbac';

export async function GET(request, { params }) {
  try {
    const auth = await requirePermission(request, { section: 'employees', action: 'VIEW' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const { id } = await params;

    const employee = await Employee.findByPk(id, {
      include: [
        { model: Department, as: 'department' },
        {
          model: ImmigrationRecord,
          as: 'immigrationRecords',
          include: [{ model: VisaType, as: 'visaType' }],
        },
        { model: RightToWork, as: 'rtwChecks' },
      ],
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, employee });
  } catch (error) {
    console.error('Employee GET by ID error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await requirePermission(request, { section: 'employees', action: 'EDIT' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const { id } = await params;
    const body = await request.json();

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

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

    await employee.update(body);

    const updated = await Employee.findByPk(id, {
      include: [
        { model: Department, as: 'department' },
        {
          model: ImmigrationRecord,
          as: 'immigrationRecords',
          include: [{ model: VisaType, as: 'visaType' }],
        },
        { model: RightToWork, as: 'rtwChecks' },
      ],
    });

    return NextResponse.json({ success: true, employee: updated });
  } catch (error) {
    console.error('Employee PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requirePermission(request, { section: 'employees', action: 'DELETE' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const { id } = await params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Clean up dependent child records to prevent foreign key errors
    await Promise.allSettled([
      LeaveRequest.destroy({ where: { employeeId: id } }),
      RightToWork.destroy({ where: { employeeId: id } }),
      ImmigrationRecord.destroy({ where: { employeeId: id } }),
      User.update({ employeeId: null }, { where: { employeeId: id } }),
    ]);

    await employee.destroy();
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Employee DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
