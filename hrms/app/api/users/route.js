import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';
import {
  parseSessionToken,
  SUPER_ADMIN_USER_OBJECT,
  isSuperAdminIdentifier,
  ensureDefaultAdminExists,
} from '@/lib/auth/systemAccounts';

export async function GET(request) {
  try {
    await initDb();
    await ensureDefaultAdminExists(User, Role, bcrypt);

    // Check requester session
    const tokenFromCookie = request.cookies.get('hrms_session_token')?.value;
    const authHeader = request.headers.get('authorization');
    const token = tokenFromCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
    const session = parseSessionToken(token);

    const isSuperAdminRequester =
      session?.uid === 'system-superadmin' || session?.role === 'Super Admin';

    let dbUsers = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [
        { model: Role, as: 'role' },
        { model: Employee, as: 'employee', attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'jobTitle'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Strip any accidental superadmin records from DB so only the virtual user can represent it
    dbUsers = dbUsers.filter(
      (u) => !isSuperAdminIdentifier(u.username) && !isSuperAdminIdentifier(u.email)
    );

    // If requester is Super Admin, prepend the virtual superadmin user
    // Otherwise, return only DB users (Super Admin is completely hidden)
    let usersList = dbUsers;
    if (isSuperAdminRequester) {
      usersList = [SUPER_ADMIN_USER_OBJECT, ...dbUsers];
    }

    return NextResponse.json({ success: true, users: usersList });
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

    const requestedUsername = (body.username || '').trim();
    const requestedEmail = (body.email || '').trim();

    // Block any attempt to create a Super Admin account
    if (isSuperAdminIdentifier(requestedUsername) || isSuperAdminIdentifier(requestedEmail)) {
      return NextResponse.json(
        { success: false, error: 'The Super Admin username/email is system-reserved.' },
        { status: 400 }
      );
    }

    // Block assigning Super Admin role
    if (body.roleId) {
      const targetRole = await Role.findByPk(body.roleId);
      if (targetRole && targetRole.name === 'Super Admin') {
        return NextResponse.json(
          { success: false, error: 'The Super Admin role cannot be assigned.' },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      username: requestedUsername || (body.name ? body.name.toLowerCase().replace(/\s+/g, '') : 'user'),
      name: body.name,
      email: requestedEmail || `${(requestedUsername || body.name || 'user').toLowerCase().replace(/\s+/g, '')}@hrms.local`,
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
