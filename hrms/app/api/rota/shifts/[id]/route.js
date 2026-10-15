import { NextResponse } from 'next/server';
import {
  initDb,
  Shift,
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

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return NextResponse.json({ success: false, error: 'Shift not found' }, { status: 404 });
    }

    const shiftDate = body.shiftDate || shift.shiftDate;
    const startTime = body.startTime || shift.startTime;
    const endTime = body.endTime || shift.endTime;
    const breakMinutes = body.breakMinutes !== undefined ? parseInt(body.breakMinutes, 10) : shift.breakMinutes;
    const plannedHours = body.plannedHours !== undefined
      ? parseFloat(body.plannedHours)
      : calculateHours(startTime, endTime, breakMinutes);
    const dayName = body.dayName || getDayName(shiftDate);

    await shift.update({
      employeeId: body.employeeId || shift.employeeId,
      shiftDate,
      dayName,
      startTime,
      endTime,
      breakMinutes,
      plannedHours,
      shiftType: body.shiftType || shift.shiftType,
      notes: body.notes !== undefined ? body.notes : shift.notes,
    });

    const updated = await Shift.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
    });

    return NextResponse.json({ success: true, shift: updated });
  } catch (error) {
    console.error('Shift PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const shift = await Shift.findByPk(id);
    if (!shift) {
      return NextResponse.json({ success: false, error: 'Shift not found' }, { status: 404 });
    }

    await shift.destroy();
    return NextResponse.json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Shift DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
