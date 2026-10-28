import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const ImmigrationRecord = sequelize.define('ImmigrationRecord', {
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
  visaTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'visa_type_id',
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  niNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'ni_number',
  },
  passportNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'passport_number',
  },
  passportExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'passport_expiry_date',
  },
  brpOrEvisaNumber: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'brp_or_evisa_number',
  },
  visaStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'visa_start_date',
  },
  visaExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'visa_expiry_date',
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'issue_date',
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'expiry_date',
  },
  sponsorLicenceNo: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'sponsor_licence_no',
  },
  sponsorCosNumber: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'sponsor_cos_number',
  },
  cosNumber: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'cos_number',
  },
  isSkilledWorkerEligible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_skilled_worker_eligible',
  },
  offeredSalary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'offered_salary',
  },
  salaryMeetsThreshold: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'salary_meets_threshold',
  },
  rightToWorkStatus: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'right_to_work_status',
  },
  shareCode: {
    type: DataTypes.STRING(40),
    allowNull: true,
    field: 'share_code',
  },
  passportPhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'passport_photo',
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'document_url',
  },
  lastVerifiedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'last_verified_date',
  },
  nextReviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'next_review_date',
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'VALID',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'immigration_records',
  timestamps: true,
  underscored: true,
});

export default ImmigrationRecord;

