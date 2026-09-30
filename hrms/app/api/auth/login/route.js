import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee, Department } from '@/lib/db/models/index';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

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

    // Find user by username or email
    const user = await User.findOne({
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

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'This account has been deactivated. Please contact HR or an administrator.' },
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

    // Create a safe token string encoded with user id and role
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

    // Set cookie for browser sessions
    response.cookies.set('hrms_session_token', sessionToken, {
      httpOnly: false, // Accessible to client auth provider
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
