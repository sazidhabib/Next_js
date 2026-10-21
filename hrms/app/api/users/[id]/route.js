import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;

    // Disallow modifying virtual Super Admin
    if (id === 'system-superadmin') {
      return NextResponse.json(
        { success: false, error: 'Super Admin credentials are system-locked and cannot be altered.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const user = await User.findByPk(id);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const updateData = { ...body };

    if (body.username) {
      const { Op } = await import('sequelize');
      const existingUser = await User.findOne({
        where: {
          username: body.username.trim(),
          id: { [Op.ne]: id },
        },
      });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: `The username '${body.username.trim()}' is already taken by another user.` },
          { status: 400 }
        );
      }
      updateData.username = body.username.trim();
    }

    if (body.employeeId !== undefined) {
      updateData.employeeId = body.employeeId ? parseInt(body.employeeId, 10) : null;
    }

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

    // Disallow deleting virtual Super Admin
    if (id === 'system-superadmin') {
      return NextResponse.json(
        { success: false, error: 'The Super Admin account is protected and cannot be deleted.' },
        { status: 403 }
      );
    }

    const user = await User.findByPk(id);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    await user.destroy();
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
