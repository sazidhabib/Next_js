import { NextResponse } from 'next/server';
import {
  initDb,
  LeaveRequest,
  Employee,
} from '@/lib/db/models/index';

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const leaveRequests = await LeaveRequest.findAll({
      where,
      include: [
        { model: Employee, as: 'employee' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ success: true, leaveRequests });
  } catch (error) {
    console.error('Leave GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

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
