import sequelize from '../sequelize.js';
import Department from './Department.js';
import Role from './Role.js';
import User from './User.js';
import Employee from './Employee.js';
import VisaType from './VisaType.js';
import ImmigrationRecord from './ImmigrationRecord.js';
import RightToWork from './RightToWork.js';
import LeaveRequest from './LeaveRequest.js';

// Department <-> Employee
Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Role <-> User
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Employee <-> User
Employee.hasOne(User, { foreignKey: 'employee_id', as: 'user' });
User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee <-> ImmigrationRecord
Employee.hasMany(ImmigrationRecord, { foreignKey: 'employee_id', as: 'immigrationRecords' });
ImmigrationRecord.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// VisaType <-> ImmigrationRecord
VisaType.hasMany(ImmigrationRecord, { foreignKey: 'visa_type_id', as: 'records' });
ImmigrationRecord.belongsTo(VisaType, { foreignKey: 'visa_type_id', as: 'visaType' });

// Employee <-> RightToWork
Employee.hasMany(RightToWork, { foreignKey: 'employee_id', as: 'rtwChecks' });
RightToWork.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee <-> LeaveRequest
Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

let isInitialized = false;

export async function initDb() {
  if (isInitialized) {
    return {
      sequelize,
      models: { Department, Role, User, Employee, VisaType, ImmigrationRecord, RightToWork, LeaveRequest },
    };
  }

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    isInitialized = true;
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
};
