import { NextResponse } from 'next/server';
import {
  initDb,
  Timesheet,
  Employee,
  Department,
} from '@/lib/db/models/index';

function calculateHours(start, end, breakMin = 0) {
  if (!start || !end) return 0;
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
  if (totalMin < 0) totalMin += 24 * 60;
  totalMin -= (Number(breakMin) || 0);
  if (totalMin < 0) totalMin = 0;
  return parseFloat((totalMin / 60).toFixed(2));
}

function getDayName(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export async function PUT(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) {
      return NextResponse.json({ success: false, error: 'Timesheet not found' }, { status: 404 });
    }

    const workDate = body.workDate || timesheet.workDate;
    const clockIn = body.clockIn || timesheet.clockIn;
    const clockOut = body.clockOut || timesheet.clockOut;
    const breakMinutes = body.breakMinutes !== undefined ? parseInt(body.breakMinutes, 10) : timesheet.breakMinutes;
    const paidHours = body.paidHours !== undefined
      ? parseFloat(body.paidHours)
      : calculateHours(clockIn, clockOut, breakMinutes);
    const dayName = body.dayName || getDayName(workDate);

    const approvalStatus = body.approvalStatus || timesheet.approvalStatus;
    const approvedAt = approvalStatus === 'Approved' && timesheet.approvalStatus !== 'Approved'
      ? new Date()
      : timesheet.approvedAt;

    await timesheet.update({
      employeeId: body.employeeId || timesheet.employeeId,
      workDate,
      dayName,
      clockIn,
      clockOut,
      breakMinutes,
      paidHours,
      approvalStatus,
      notes: body.notes !== undefined ? body.notes : timesheet.notes,
      approvedBy: body.approvedBy !== undefined ? body.approvedBy : timesheet.approvedBy,
      approvedAt,
    });

    const updated = await Timesheet.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
    });

    return NextResponse.json({ success: true, timesheet: updated });
  } catch (error) {
    console.error('Timesheet PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) {
      return NextResponse.json({ success: false, error: 'Timesheet not found' }, { status: 404 });
    }

    await timesheet.destroy();
    return NextResponse.json({ success: true, message: 'Timesheet deleted successfully' });
  } catch (error) {
    console.error('Timesheet DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
