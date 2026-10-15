import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
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
  if (totalMin < 0) totalMin += 24 * 60; // Overnight shift support
  totalMin -= (Number(breakMin) || 0);
  if (totalMin < 0) totalMin = 0;
  return parseFloat((totalMin / 60).toFixed(2));
}

function getDayName(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const weekCommencing = searchParams.get('week');
    const workDate = searchParams.get('date');
    const status = searchParams.get('status');

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (workDate) where.workDate = workDate;
    if (status && status !== 'ALL') where.approvalStatus = status;

    if (weekCommencing) {
      const startDate = weekCommencing;
      const end = new Date(weekCommencing + 'T00:00:00');
      end.setDate(end.getDate() + 6);
      const endDate = end.toISOString().split('T')[0];
      where.workDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const timesheets = await Timesheet.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
      order: [
        ['workDate', 'DESC'],
        ['clockIn', 'ASC'],
      ],
    });

    return NextResponse.json({ success: true, timesheets });
  } catch (error) {
    console.error('Timesheets GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const dayName = body.dayName || getDayName(body.workDate);
    const breakMinutes = parseInt(body.breakMinutes, 10) || 0;
    const paidHours = body.paidHours !== undefined
      ? parseFloat(body.paidHours)
      : calculateHours(body.clockIn, body.clockOut, breakMinutes);

    const timesheet = await Timesheet.create({
      employeeId: body.employeeId,
      workDate: body.workDate,
      dayName,
      clockIn: body.clockIn,
      clockOut: body.clockOut,
      breakMinutes,
      paidHours,
      approvalStatus: body.approvalStatus || 'Pending',
      notes: body.notes || '',
      approvedBy: body.approvedBy || null,
      approvedAt: body.approvalStatus === 'Approved' ? new Date() : null,
    });

    const fetched = await Timesheet.findByPk(timesheet.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
    });

    return NextResponse.json({ success: true, timesheet: fetched }, { status: 201 });
  } catch (error) {
    console.error('Timesheets POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
