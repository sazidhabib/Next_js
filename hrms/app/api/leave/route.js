import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import {
  initDb,
  LeaveRequest,
  Employee,
} from '@/lib/db/models/index';
import { requirePermission, hasSessionPermission } from '@/lib/auth/rbac';

export async function GET(request) {
  try {
    const auth = await requirePermission(request, [
      { section: 'leave', action: 'VIEW' },
      'VIEW_LEAVE',
      'REQUEST_LEAVE',
    ]);
    if (!auth.authorized) return auth.response;

    await initDb();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const canViewAll = hasSessionPermission(auth.session, [
      { section: 'leave', action: 'VIEW' },
      { section: 'leave', action: 'EDIT' },
      'VIEW_LEAVE',
      'APPROVE_LEAVES',
    ]);

    const where = {};
    if (employeeId && employeeId !== 'ALL') {
      where.employeeId = employeeId;
    } else if (!canViewAll && auth.session.employeeId) {
      // If user has no view permission and only self-service request permission, limit to own records
      where.employeeId = auth.session.employeeId;
    }

    if (status && status !== 'ALL') where.status = status;

    const isManager = hasSessionPermission(auth.session, [
      { section: 'leave', action: 'EDIT' },
      'APPROVE_LEAVES',
    ]);

    const leaveRequests = await LeaveRequest.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: isManager
            ? undefined
            : ['id', 'employeeCode', 'firstName', 'lastName', 'email', 'jobTitle', 'departmentId', 'photoUrl', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ success: true, leaveRequests, leaves: leaveRequests });
  } catch (error) {
    console.error('Leave GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requirePermission(request, [
      { section: 'leave', action: 'EDIT' },
      'REQUEST_LEAVE',
    ]);
    if (!auth.authorized) return auth.response;

    await initDb();
    const body = await request.json();

    // If user does not have APPROVE_LEAVES or EDIT_LEAVE, ensure status is Pending
    const canApprove = hasSessionPermission(auth.session, [
      { section: 'leave', action: 'EDIT' },
      'APPROVE_LEAVES',
    ]);
    if (!canApprove) {
      body.status = 'Pending';
      // Restrict employee to only booking for themselves
      if (auth.session.employeeId) {
        body.employeeId = auth.session.employeeId;
      }
    }

    const { startDate, endDate, employeeId } = body;

    if (!startDate || !endDate || !employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee, start date, and end date are required' },
        { status: 400 }
      );
    }

    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { success: false, error: 'Start date cannot be after end date' },
        { status: 400 }
      );
    }

    // Check for existing overlapping approved leaves by other employees
    // Overlap condition: existing.startDate <= new.endDate AND existing.endDate >= new.startDate
    const overlappingLeaves = await LeaveRequest.findAll({
      where: {
        status: { [Op.in]: ['Approved', 'APPROVED', 'approved'] },
        employeeId: { [Op.ne]: employeeId },
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate },
      },
      include: [{ model: Employee, as: 'employee' }],
    });

    // Group by distinct employee
    const distinctEmployeeMap = new Map();
    overlappingLeaves.forEach((l) => {
      const empId = String(l.employeeId);
      if (!distinctEmployeeMap.has(empId)) {
        distinctEmployeeMap.set(empId, l);
      }
    });

    if (distinctEmployeeMap.size >= 2) {
      const conflictingNames = Array.from(distinctEmployeeMap.values()).map((l) => {
        const empName = l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : `Employee #${l.employeeId}`;
        return `${empName} (${l.startDate} to ${l.endDate})`;
      });

      return NextResponse.json(
        {
          success: false,
          blocked: true,
          error: `Booking blocked: 2 employees already have approved leave during this date period (${startDate} to ${endDate}): ${conflictingNames.join(', ')}. Maximum 2 concurrent employees allowed.`,
          conflicts: Array.from(distinctEmployeeMap.values()),
        },
        { status: 400 }
      );
    }

    const leave = await LeaveRequest.create(body);
    const fetched = await LeaveRequest.findByPk(leave.id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, leaveRequest: fetched }, { status: 201 });
  } catch (error) {
    console.error('Leave POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
