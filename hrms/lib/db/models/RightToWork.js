import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const RightToWork = sequelize.define('RightToWork', {
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
  checkDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_date',
  },
  checkMethod: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Online Home Office Share Code Check',
    field: 'check_method',
  },
  checkType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'ONLINE_SHARE_CODE',
    field: 'check_type',
  },
  documentType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Passport / Share Code',
    field: 'document_type',
  },
  documentRef: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'document_ref',
  },
  documentRefNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'document_ref_number',
  },
  performedByUserId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'performed_by_user_id',
  },
  verifiedBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'verified_by',
  },
  outcome: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Continuous Right to Work',
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'follow_up_required',
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'follow_up_date',
  },
  nextReviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'next_review_date',
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'document_url',
  },
  statutoryExcuseGranted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'statutory_excuse_granted',
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'VERIFIED',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'right_to_work_checks',
  timestamps: true,
  underscored: true,
});

export default RightToWork;

