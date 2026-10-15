import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Shift = sequelize.define('Shift', {
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
  shiftDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'shift_date',
  },
  dayName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'day_name',
  },
  startTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'start_time',
  },
  endTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'end_time',
  },
  breakMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'break_minutes',
  },
  plannedHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'planned_hours',
  },
  shiftType: {
    type: DataTypes.STRING(40),
    allowNull: false,
    defaultValue: 'Standard',
    field: 'shift_type',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'rota_shifts',
  timestamps: true,
  underscored: true,
});

export default Shift;
