import { NextResponse } from 'next/server';

const FIELD_LABELS = {
  email: 'Email',
  employeeCode: 'Employee ID / Code',
  employee_code: 'Employee ID / Code',
  username: 'Username',
  name: 'Name',
  code: 'Code',
  firstName: 'First Name',
  first_name: 'First Name',
  lastName: 'Last Name',
  last_name: 'Last Name',
  phone: 'Phone No',
  dateOfBirth: 'Date Of Birth',
  date_of_birth: 'Date Of Birth',
  shareCode: 'Share Code',
  share_code: 'Share Code',
  niNumber: 'NI Number',
  ni_number: 'NI Number',
  passportNumber: 'Passport Number',
  passport_number: 'Passport Number',
  employeeId: 'Employee',
  employee_id: 'Employee',
  shiftDate: 'Shift Date',
  shift_date: 'Shift Date',
  workDate: 'Work Date',
  work_date: 'Work Date',
  checkDate: 'Check Date',
  check_date: 'Check Date',
  visaExpiryDate: 'Visa Expiry Date',
  visa_expiry_date: 'Visa Expiry Date',
};

function formatFieldName(raw) {
  if (!raw) return 'field';
  if (FIELD_LABELS[raw]) return FIELD_LABELS[raw];
  return raw
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Converts Sequelize and runtime errors into clear, user-friendly JSON error responses.
 */
export function apiErrorResponse(error, { status = 400, context = 'API' } = {}) {
  console.error(`${context} error:`, error);

  if (error?.name === 'SequelizeUniqueConstraintError') {
    const rawFields =
      error.errors?.map((e) => e.path).filter(Boolean) ||
      (error.fields ? Object.keys(error.fields) : []);
    const uniqueFields = [...new Set(rawFields.map(formatFieldName))];
    const fieldText = uniqueFields.length > 0 ? uniqueFields.join(', ') : 'Record';
    return NextResponse.json(
      {
        success: false,
        error: `Duplicate value: ${fieldText} already exists. Please use a unique value.`,
      },
      { status: 400 }
    );
  }

  if (error?.name === 'SequelizeValidationError') {
    const messages = (error.errors || []).map((e) => {
      const label = formatFieldName(e.path);
      if (e.validatorKey === 'isEmail') {
        return `${label} must be a valid email address.`;
      }
      if (e.validatorKey === 'is_null' || e.type === 'notNull Violation') {
        return `${label} is required.`;
      }
      return e.message || `${label} is invalid.`;
    });
    const detail = messages.length > 0 ? messages.join(' ') : error.message;
    return NextResponse.json({ success: false, error: detail }, { status: 400 });
  }

  if (error?.name === 'SequelizeForeignKeyConstraintError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid reference: the selected related record does not exist or is in use.',
      },
      { status: 400 }
    );
  }

  if (error?.name === 'SequelizeDatabaseError') {
    const dbMsg = error.parent?.sqlMessage || error.message;
    return NextResponse.json({ success: false, error: dbMsg }, { status: 400 });
  }

  return NextResponse.json(
    { success: false, error: error?.message || 'An unexpected error occurred.' },
    { status }
  );
}
