import { NextResponse } from 'next/server';
import {
  initDb,
  Department,
  Employee,
} from '@/lib/db/models/index';
import { requirePermission } from '@/lib/auth/rbac';

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
    const auth = await requirePermission(request, { section: 'departments', action: 'EDIT' });
    if (!auth.authorized) return auth.response;

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
    const auth = await requirePermission(request, { section: 'departments', action: 'DELETE' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const { id } = await params;
    const department = await Department.findByPk(id);
    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    // Unlink employees from this department so deletion never fails due to foreign key constraints
    await Employee.update({ departmentId: null }, { where: { departmentId: id } }).catch(() => {});

    await department.destroy();
    return NextResponse.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
