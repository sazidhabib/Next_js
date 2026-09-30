import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee, Department } from '@/lib/db/models/index';

export async function GET(request) {
  try {
    await initDb();

    // Check cookie or authorization header
    const tokenFromCookie = request.cookies.get('hrms_session_token')?.value;
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'No active session' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      const decodedString = Buffer.from(token, 'base64').toString('utf-8');
      decoded = JSON.parse(decodedString);
    } catch (e) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

    if (!decoded?.uid) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Invalid session payload' },
        { status: 401 }
      );
    }

    const user = await User.findByPk(decoded.uid, {
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

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'User account inactive or not found' },
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

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: userData,
    });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json(
      { success: false, authenticated: false, message: error.message },
      { status: 500 }
    );
  }
}
