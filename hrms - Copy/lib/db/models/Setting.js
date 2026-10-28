import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  appName: {
    type: DataTypes.STRING(120),
    allowNull: false,
    defaultValue: 'HRMS Pro',
    field: 'app_name',
  },
  appSubtitle: {
    type: DataTypes.STRING(120),
    allowNull: true,
    defaultValue: 'Enterprise Compliance',
    field: 'app_subtitle',
  },
  companyName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    defaultValue: 'The Royal Kitchen Hospitality Ltd',
    field: 'company_name',
  },
  appLogo: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    field: 'app_logo',
  },
  sponsorLicenceNo: {
    type: DataTypes.STRING(80),
    allowNull: true,
    defaultValue: '0W01ABC89',
    field: 'sponsor_licence_no',
  },
  complianceOfficer: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'James Wilson',
    field: 'compliance_officer',
  },
  complianceEmail: {
    type: DataTypes.STRING(120),
    allowNull: true,
    defaultValue: 'compliance@hrms.local',
    field: 'compliance_email',
  },
  currencySymbol: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '£',
    field: 'currency_symbol',
  },
  visaWarningDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 90,
    field: 'visa_warning_days',
  },
  rtwWarningDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30,
    field: 'rtw_warning_days',
  },
}, {
  tableName: 'app_settings',
  timestamps: true,
  underscored: true,
});

export default Setting;
