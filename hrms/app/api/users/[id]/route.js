import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    const user = await User.findByPk(id);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const updateData = { ...body };
    if (body.password) {
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
      delete updateData.password;
    }

    await user.update(updateData);
    const updated = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
      include: [{ model: Role, as: 'role' }, { model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const user = await User.findByPk(id);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    await user.destroy();
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
