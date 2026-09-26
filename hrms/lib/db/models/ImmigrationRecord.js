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
    allowNull: false,
    field: 'visa_type_id',
  },
  passportNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'passport_number',
  },
  brpOrEvisaNumber: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: 'brp_or_evisa_number',
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'issue_date',
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'expiry_date',
  },
  shareCode: {
    type: DataTypes.STRING(40),
    allowNull: true,
    field: 'share_code',
  },
  sponsorCosNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'sponsor_cos_number',
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'document_url',
  },
  status: {
    type: DataTypes.ENUM('VALID', 'EXPIRING_SOON', 'EXPIRED', 'REVOKED'),
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
