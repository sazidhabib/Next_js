import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await initDb();
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [
        { model: Role, as: 'role' },
        { model: Employee, as: 'employee', attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'jobTitle'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    if (!body.password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email,
      passwordHash,
      roleId: body.roleId || null,
      employeeId: body.employeeId || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    const created = await User.findByPk(user.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [{ model: Role, as: 'role' }, { model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, user: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
