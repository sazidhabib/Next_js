import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const LeaveRequest = sequelize.define('LeaveRequest', {
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
  leaveType: {
    type: DataTypes.ENUM('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'EMERGENCY'),
    allowNull: false,
    defaultValue: 'ANNUAL',
    field: 'leave_type',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
  },
  totalDays: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false,
    defaultValue: 1.0,
    field: 'total_days',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  adminComments: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'admin_comments',
  },
}, {
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true,
});

export default LeaveRequest;
