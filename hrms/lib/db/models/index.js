import sequelize from '../sequelize.js';
import Department from './Department.js';
import Role from './Role.js';
import User from './User.js';
import Employee from './Employee.js';
import VisaType from './VisaType.js';
import ImmigrationRecord from './ImmigrationRecord.js';
import RightToWork from './RightToWork.js';
import LeaveRequest from './LeaveRequest.js';
import Setting from './Setting.js';
import MediaFile from './MediaFile.js';
import Shift from './Shift.js';
import Timesheet from './Timesheet.js';

// Safely define associations once (prevents duplicate alias errors on Next.js Turbopack / Fast Refresh)
function setupAssociations() {
  // Department <-> Employee
  if (!Department.associations?.employees) {
    Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });
  }
  if (!Employee.associations?.department) {
    Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
  }

  // Role <-> User
  if (!Role.associations?.users) {
    Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
  }
  if (!User.associations?.role) {
    User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
  }

  // Employee <-> User
  if (!Employee.associations?.user) {
    Employee.hasOne(User, { foreignKey: 'employee_id', as: 'user' });
  }
  if (!User.associations?.employee) {
    User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }

  // Employee <-> ImmigrationRecord
  if (!Employee.associations?.immigrationRecords) {
    Employee.hasMany(ImmigrationRecord, { foreignKey: 'employee_id', as: 'immigrationRecords' });
  }
  if (!ImmigrationRecord.associations?.employee) {
    ImmigrationRecord.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }

  // VisaType <-> ImmigrationRecord
  if (!VisaType.associations?.records) {
    VisaType.hasMany(ImmigrationRecord, { foreignKey: 'visa_type_id', as: 'records' });
  }
  if (!ImmigrationRecord.associations?.visaType) {
    ImmigrationRecord.belongsTo(VisaType, { foreignKey: 'visa_type_id', as: 'visaType' });
  }

  // Employee <-> RightToWork
  if (!Employee.associations?.rtwChecks) {
    Employee.hasMany(RightToWork, { foreignKey: 'employee_id', as: 'rtwChecks' });
  }
  if (!RightToWork.associations?.employee) {
    RightToWork.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }

  // Employee <-> LeaveRequest
  if (!Employee.associations?.leaveRequests) {
    Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests' });
  }
  if (!LeaveRequest.associations?.employee) {
    LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }

  // Employee <-> Shift (Weekly Rota)
  if (!Employee.associations?.shifts) {
    Employee.hasMany(Shift, { foreignKey: 'employee_id', as: 'shifts' });
  }
  if (!Shift.associations?.employee) {
    Shift.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }

  // Employee <-> Timesheet
  if (!Employee.associations?.timesheets) {
    Employee.hasMany(Timesheet, { foreignKey: 'employee_id', as: 'timesheets' });
  }
  if (!Timesheet.associations?.employee) {
    Timesheet.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  }
}

setupAssociations();

// Global cached initialization state across Next.js dev server reloads
let isInitialized = global._hrmsDbInitialized || false;

export async function initDb() {
  if (isInitialized) {
    return {
      sequelize,
      models: { Department, Role, User, Employee, VisaType, ImmigrationRecord, RightToWork, LeaveRequest, Setting, MediaFile, Shift, Timesheet },
    };
  }

  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Ensure departments.code is nullable in existing database tables
    try {
      await sequelize.query('ALTER TABLE departments MODIFY COLUMN code VARCHAR(50) NULL DEFAULT NULL;');
    } catch {
      // Ignored for non-MySQL or if already applied
    }

    // Ensure employees.job_title is nullable in existing database tables
    try {
      await sequelize.query('ALTER TABLE employees MODIFY COLUMN job_title VARCHAR(80) NULL DEFAULT NULL;');
    } catch {
      // Ignored for non-MySQL or if already applied
    }

    // Ensure employees.holiday_allowance column exists in existing database tables
    try {
      await sequelize.query('ALTER TABLE employees ADD COLUMN holiday_allowance DECIMAL(4, 1) DEFAULT 28.0;');
    } catch {
      // Ignored if column already exists
    }

    isInitialized = true;
    global._hrmsDbInitialized = true;
  } catch (error) {
    console.warn('Database sync Notice:', error.message);
  }

  return {
    sequelize,
    models: {
      Department,
      Role,
      User,
      Employee,
      VisaType,
      ImmigrationRecord,
      RightToWork,
      LeaveRequest,
      Setting,
      MediaFile,
      Shift,
      Timesheet,
    },
  };
}

export {
  sequelize,
  Department,
  Role,
  User,
  Employee,
  VisaType,
  ImmigrationRecord,
  RightToWork,
  LeaveRequest,
  Setting,
  MediaFile,
  Shift,
  Timesheet,
};


