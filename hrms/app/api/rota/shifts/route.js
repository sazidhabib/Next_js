import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const weekCommencing = searchParams.get('week');
    const shiftDate = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month'); // format: YYYY-MM

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (shiftDate) where.shiftDate = shiftDate;

    if (startDate && endDate) {
      where.shiftDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (month) {
      const [year, m] = month.split('-').map(Number);
      const firstDay = `${year}-${String(m).padStart(2, '0')}-01`;
      const lastDayDate = new Date(year, m, 0);
      const lastDay = `${year}-${String(m).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;
      where.shiftDate = {
        [Op.between]: [firstDay, lastDay],
      };
    } else if (weekCommencing) {
      const start = weekCommencing;
      const [y, m, d] = weekCommencing.split('-').map(Number);
      const end = new Date(y, m - 1, d + 6);
      const endFormatted = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
      where.shiftDate = {
        [Op.between]: [start, endFormatted],
      };
    }

    const shifts = await Shift.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
      order: [
        ['shiftDate', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return NextResponse.json(
      { success: true, shifts },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Shifts GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const dayName = body.dayName || getDayName(body.shiftDate);
    const breakMinutes = parseInt(body.breakMinutes, 10) || 0;
    const plannedHours = body.plannedHours !== undefined
      ? parseFloat(body.plannedHours)
      : calculateHours(body.startTime, body.endTime, breakMinutes);

    const shift = await Shift.create({
      employeeId: body.employeeId,
      shiftDate: body.shiftDate,
      dayName,
      startTime: body.startTime,
      endTime: body.endTime,
      breakMinutes,
      plannedHours,
      shiftType: body.shiftType || 'Standard',
      notes: body.notes || '',
    });

    const fetched = await Shift.findByPk(shift.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
    });

    return NextResponse.json(
      { success: true, shift: fetched },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Shifts POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
