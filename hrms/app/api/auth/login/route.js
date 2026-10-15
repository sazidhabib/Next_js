import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee, Department } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import {
  isSuperAdminIdentifier,
  verifySuperAdminPassword,
  SUPER_ADMIN_USER_OBJECT,
  DEFAULT_ADMIN_CREDENTIALS,
} from '@/lib/auth/systemAccounts';

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { identifier, username, email, password } = body;
    const loginIdentifier = (identifier || username || email || '').trim();

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter your username/email and password.' },
        { status: 400 }
      );
    }

    // 1. Virtual Hardcoded Super Admin check
    if (isSuperAdminIdentifier(loginIdentifier)) {
      if (!verifySuperAdminPassword(password)) {
        return NextResponse.json(
          { success: false, message: 'Invalid password. Please verify and try again.' },
          { status: 401 }
        );
      }

      const sessionPayload = {
        uid: SUPER_ADMIN_USER_OBJECT.id,
        role: SUPER_ADMIN_USER_OBJECT.roleName,
        time: Date.now(),
      };
      const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully as Super Administrator',
        user: SUPER_ADMIN_USER_OBJECT,
        token: sessionToken,
      });

      response.cookies.set('hrms_session_token', sessionToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // 2. Database User Lookup
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { username: loginIdentifier },
          { email: loginIdentifier },
        ],
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'description', 'permissions'],
        },
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name', 'code'],
            },
          ],
        },
      ],
    });

    // If Admin account is missing in DB (e.g. fresh DB), auto-initialize admin in MySQL
    const isAdminIdentifier =
      loginIdentifier.toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.username.toLowerCase() ||
      loginIdentifier.toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase();

    if (!user && isAdminIdentifier) {
      let adminRole = await Role.findOne({ where: { name: 'Admin' } });
      if (!adminRole) {
        adminRole = await Role.create({
          name: 'Admin',
          description: 'Full system operations control',
          permissions: ['ALL'],
        });
      }

      const defaultHash = await bcrypt.hash(DEFAULT_ADMIN_CREDENTIALS.defaultPassword, 10);
      const newAdmin = await User.create({
        username: DEFAULT_ADMIN_CREDENTIALS.username,
        email: DEFAULT_ADMIN_CREDENTIALS.email,
        name: DEFAULT_ADMIN_CREDENTIALS.name,
        passwordHash: defaultHash,
        roleId: adminRole.id,
        isActive: true,
      });

      user = await User.findByPk(newAdmin.id, {
        include: [{ model: Role, as: 'role' }],
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'This account has been deactivated. Please contact an administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please verify and try again.' },
        { status: 401 }
      );
    }

    const roleName = user.role?.name || 'Employee';
    let permissions = user.role?.permissions || [];
    if (typeof permissions === 'string') {
      try {
        permissions = JSON.parse(permissions);
      } catch (e) {
        permissions = [permissions];
      }
    }

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: roleName,
      permissions: permissions,
      employeeId: user.employeeId,
      employee: user.employee
        ? {
            id: user.employee.id,
            employeeCode: user.employee.employeeCode,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            jobTitle: user.employee.jobTitle,
            department: user.employee.department?.name,
            departmentId: user.employee.departmentId,
            photoUrl: user.employee.photoUrl,
            weeklyHours: user.employee.weeklyHours,
            isSponsoredWorker: user.employee.isSponsoredWorker,
          }
        : null,
    };

    const sessionPayload = {
      uid: user.id,
      role: roleName,
      time: Date.now(),
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: userData,
      token: sessionToken,
    });

    response.cookies.set('hrms_session_token', sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during login: ' + error.message },
      { status: 500 }
    );
  }
}
