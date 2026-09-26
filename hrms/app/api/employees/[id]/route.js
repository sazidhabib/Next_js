import { NextResponse } from 'next/server';
import {
  initDb,
  Employee,
  Department,
  ImmigrationRecord,
  RightToWork,
  VisaType,
} from '@/lib/db/models/index';

export async function GET(request, { params }) {
  try {
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
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

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
    await initDb();
    const { id } = await params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    await employee.destroy();
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Employee DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
