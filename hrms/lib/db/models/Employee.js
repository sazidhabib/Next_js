import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeCode: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    field: 'employee_code',
  },
  firstName: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: 'last_name',
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  addressLine1: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'address_line1',
  },
  addressLine2: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'address_line2',
  },
  city: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  postcode: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(60),
    allowNull: true,
    defaultValue: 'United Kingdom',
  },
  jobTitle: {
    type: DataTypes.STRING(80),
    allowNull: false,
    field: 'job_title',
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'department_id',
  },
  hireDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'hire_date',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'end_date',
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0.00,
  },
  weeklyHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 37.5,
    field: 'weekly_hours',
  },
  isSponsoredWorker: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_sponsored_worker',
  },
  emergencyContact: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'emergency_contact',
  },
  nextOfKin: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'next_of_kin',
  },
  photoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'photo_url',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
}, {
  tableName: 'employees',
  timestamps: true,
  underscored: true,
});

export default Employee;
