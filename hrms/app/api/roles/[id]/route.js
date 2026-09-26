import { NextResponse } from 'next/server';
import { initDb, Role } from '@/lib/db/models/index';

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    const role = await Role.findByPk(id);
    if (!role) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    await role.update(body);
    return NextResponse.json({ success: true, role });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const role = await Role.findByPk(id);
    if (!role) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    await role.destroy();
    return NextResponse.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
