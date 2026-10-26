import { NextResponse } from 'next/server';
import { initDb, Role, User } from '@/lib/db/models/index';
import { requirePermission } from '@/lib/auth/rbac';

export async function PUT(request, { params }) {
  try {
    const auth = await requirePermission(request, { section: 'roles', action: 'EDIT' });
    if (!auth.authorized) return auth.response;

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
    const auth = await requirePermission(request, { section: 'roles', action: 'DELETE' });
    if (!auth.authorized) return auth.response;

    await initDb();
    const { id } = await params;
    const role = await Role.findByPk(id);
    if (!role) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });

    // Unlink users from this role to prevent foreign key errors
    await User.update({ roleId: null }, { where: { roleId: id } }).catch(() => {});

    await role.destroy();
    return NextResponse.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
