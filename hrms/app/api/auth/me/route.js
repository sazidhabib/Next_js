import { NextResponse } from 'next/server';
import { initDb, User, Role, Employee, Department } from '@/lib/db/models/index';
import { SUPER_ADMIN_USER_OBJECT } from '@/lib/auth/systemAccounts';

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
        { success: true, authenticated: false, user: null, message: 'No active session' },
        { status: 200 }
      );
    }

    let decoded;
    try {
      const decodedString = Buffer.from(token, 'base64').toString('utf-8');
      decoded = JSON.parse(decodedString);
    } catch (e) {
      return NextResponse.json(
        { success: true, authenticated: false, user: null, message: 'Invalid token format' },
        { status: 200 }
      );
    }

    if (!decoded?.uid) {
      return NextResponse.json(
        { success: true, authenticated: false, user: null, message: 'Invalid session payload' },
        { status: 200 }
      );
    }

    // Check if Super Admin virtual session
    if (decoded.uid === 'system-superadmin' || decoded.role === 'Super Admin') {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: SUPER_ADMIN_USER_OBJECT,
      });
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
        { success: true, authenticated: false, user: null, message: 'User account inactive or not found' },
        { status: 200 }
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

    let linkedEmp = user.employee;
    if (!linkedEmp && user.email) {
      linkedEmp = await Employee.findOne({
        where: { email: user.email },
        include: [{ model: Department, as: 'department', attributes: ['id', 'name', 'code'] }],
      });
      if (linkedEmp && !user.employeeId) {
        user.update({ employeeId: linkedEmp.id }).catch(() => {});
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
      employeeId: user.employeeId || linkedEmp?.id || null,
      employee: linkedEmp
        ? {
            id: linkedEmp.id,
            employeeCode: linkedEmp.employeeCode,
            firstName: linkedEmp.firstName,
            lastName: linkedEmp.lastName,
            jobTitle: linkedEmp.jobTitle,
            department: linkedEmp.department?.name,
            departmentId: linkedEmp.departmentId,
            photoUrl: linkedEmp.photoUrl,
            weeklyHours: linkedEmp.weeklyHours,
            isSponsoredWorker: linkedEmp.isSponsoredWorker,
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
