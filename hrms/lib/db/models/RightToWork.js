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
  checkType: {
    type: DataTypes.ENUM('ONLINE_SHARE_CODE', 'MANUAL_DOCUMENT', 'DIGITAL_IDSP'),
    allowNull: false,
    defaultValue: 'ONLINE_SHARE_CODE',
    field: 'check_type',
  },
  checkDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_date',
  },
  nextReviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'next_review_date',
  },
  verifiedBy: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'verified_by',
  },
  documentType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Passport / Share Code',
    field: 'document_type',
  },
  documentRefNumber: {
    type: DataTypes.STRING(80),
    allowNull: true,
    field: 'document_ref_number',
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
    type: DataTypes.ENUM('VERIFIED', 'PENDING_REVIEW', 'EXPIRED', 'REQUIRES_RECHECK'),
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
