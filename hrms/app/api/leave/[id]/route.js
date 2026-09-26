import { NextResponse } from 'next/server';
import {
  initDb,
  LeaveRequest,
  Employee,
} from '@/lib/db/models/index';

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const leave = await LeaveRequest.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!leave) {
      return NextResponse.json({ success: false, error: 'Leave request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, leaveRequest: leave });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      return NextResponse.json({ success: false, error: 'Leave request not found' }, { status: 404 });
    }

    if (body.status === 'APPROVED' || body.status === 'REJECTED') {
      body.approvedAt = new Date();
    }

    await leave.update(body);
    const updated = await LeaveRequest.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    return NextResponse.json({ success: true, leaveRequest: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      return NextResponse.json({ success: false, error: 'Leave request not found' }, { status: 404 });
    }

    await leave.destroy();
    return NextResponse.json({ success: true, message: 'Leave request cancelled/deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
