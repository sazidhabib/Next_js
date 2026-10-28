import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Timesheet = sequelize.define('Timesheet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
  },
  workDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'work_date',
  },
  dayName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'day_name',
  },
  clockIn: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'clock_in',
  },
  clockOut: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'clock_out',
  },
  breakMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'break_minutes',
  },
  paidHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'paid_hours',
  },
  approvalStatus: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'Pending',
    field: 'approval_status',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
}, {
  tableName: 'timesheets',
  timestamps: true,
  underscored: true,
});

export default Timesheet;
