import { NextResponse } from 'next/server';
import {
  initDb,
  Department,
  Employee,
} from '@/lib/db/models/index';

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const department = await Department.findByPk(id, {
      include: [
        { model: Employee, as: 'employees' },
      ],
    });

    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, department });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const department = await Department.findByPk(id);
    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    await department.update(body);
    return NextResponse.json({ success: true, department });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const department = await Department.findByPk(id);
    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    await department.destroy();
    return NextResponse.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
