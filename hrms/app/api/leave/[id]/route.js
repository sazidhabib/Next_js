import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
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

    const targetStatus = body.status !== undefined ? body.status : leave.status;
    const isApproved = ['Approved', 'APPROVED', 'approved'].includes(targetStatus);

    const targetStartDate = body.startDate || leave.startDate;
    const targetEndDate = body.endDate || leave.endDate;
    const targetEmployeeId = body.employeeId || leave.employeeId;

    if (isApproved) {
      // Check if approving or updating this leave would result in >= 2 other employees on approved leave
      const overlappingLeaves = await LeaveRequest.findAll({
        where: {
          id: { [Op.ne]: id },
          employeeId: { [Op.ne]: targetEmployeeId },
          status: { [Op.in]: ['Approved', 'APPROVED', 'approved'] },
          startDate: { [Op.lte]: targetEndDate },
          endDate: { [Op.gte]: targetStartDate },
        },
        include: [{ model: Employee, as: 'employee' }],
      });

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
            error: `Approval blocked: 2 employees already have approved leave during this date period (${targetStartDate} to ${targetEndDate}): ${conflictingNames.join(', ')}. A 3rd employee cannot be approved for these dates.`,
            conflicts: Array.from(distinctEmployeeMap.values()),
          },
          { status: 400 }
        );
      }

      body.approvedAt = new Date();
    } else if (body.status === 'REJECTED' || body.status === 'Rejected') {
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
