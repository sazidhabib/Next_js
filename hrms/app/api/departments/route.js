import { NextResponse } from 'next/server';
import {
  initDb,
  Department,
  Employee,
} from '@/lib/db/models/index';
import { requirePermission } from '@/lib/auth/rbac';

export async function GET() {
  try {
    await initDb();
    const departments = await Department.findAll({
      include: [
        { model: Employee, as: 'employees', attributes: ['id', 'firstName', 'lastName', 'jobTitle', 'status'] },
      ],
      order: [['name', 'ASC']],
    });

    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error('Departments GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requirePermission(request, { section: 'departments', action: 'EDIT' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const body = await request.json();

    // Auto-populate code if omitted for backwards compatibility with database column
    if (!body.code && body.name) {
      const base = body.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'DEPT';
      body.code = `${base}_${Date.now().toString(36).slice(-4).toUpperCase()}`;
    }

    const department = await Department.create(body);
    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (error) {
    console.error('Departments POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
