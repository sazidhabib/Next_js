import { NextResponse } from 'next/server';
import {
  initDb,
  Employee,
  Department,
  Role,
  VisaType,
  ImmigrationRecord,
  RightToWork,
  LeaveRequest,
} from '@/lib/db/models/index';
import { Op } from 'sequelize';

export async function GET() {
  try {
    await initDb();

    const [
      totalEmployees,
      activeEmployees,
      totalDepartments,
      rolesCount,
      pendingLeaves,
    ] = await Promise.all([
      Employee.count(),
      Employee.count({ where: { status: 'ACTIVE' } }),
      Department.count(),
      Role.count(),
      LeaveRequest.count({ where: { status: 'PENDING' } }),
    ]);

    // Unique job titles count for positions
    const distinctTitles = await Employee.findAll({
      attributes: [[Employee.sequelize.fn('DISTINCT', Employee.sequelize.col('job_title')), 'jobTitle']],
    });
    const totalPositions = Math.max(distinctTitles.length, rolesCount, 1);

    // Compute Visa alerts (within next 90 days)
    const today = new Date();
    const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const in90DaysStr = in90Days.toISOString().split('T')[0];

    const upcomingImmigration = await ImmigrationRecord.findAll({
      where: {
        expiryDate: {
          [Op.lte]: in90DaysStr,
        },
      },
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'jobTitle', 'photoUrl'] },
        { model: VisaType, as: 'visaType', attributes: ['id', 'name', 'code'] },
      ],
      order: [['expiryDate', 'ASC']],
    });

    const pendingRTW = await RightToWork.findAll({
      where: {
        [Op.or]: [
          { status: 'PENDING_REVIEW' },
          {
            nextReviewDate: {
              [Op.ne]: null,
              [Op.lte]: in90DaysStr,
            },
          },
        ],
      },
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'jobTitle', 'photoUrl'] },
      ],
      order: [['nextReviewDate', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        totalDepartments,
        totalPositions,
        expiringVisasCount: upcomingImmigration.length,
        pendingLeavesCount: pendingLeaves,
        pendingRTWCount: pendingRTW.length,
      },
      alerts: {
        immigration: upcomingImmigration,
        rtw: pendingRTW,
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
