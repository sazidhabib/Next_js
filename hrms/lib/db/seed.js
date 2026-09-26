import {
  initDb,
  Department,
  Role,
  User,
  Employee,
  VisaType,
  ImmigrationRecord,
  RightToWork,
  LeaveRequest,
  sequelize
} from './models/index.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  await initDb();
  await sequelize.sync({ force: false });

  // 1. Seed Roles
  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate([
      {
        name: 'Super Admin',
        description: 'Full system access and compliance auditing',
        permissions: ['ALL'],
      },
      {
        name: 'HR Manager',
        description: 'Manage employees, RTW checks, visas, and leaves',
        permissions: ['MANAGE_EMPLOYEES', 'MANAGE_COMPLIANCE', 'APPROVE_LEAVES'],
      },
      {
        name: 'Department Head',
        description: 'Oversee department staff and approve department leave',
        permissions: ['VIEW_DEPARTMENT', 'APPROVE_LEAVES'],
      },
      {
        name: 'Employee',
        description: 'Self-service portal for profile and leave applications',
        permissions: ['VIEW_OWN_PROFILE', 'REQUEST_LEAVE'],
      },
    ]);
  }

  // 2. Seed Departments
  const deptCount = await Department.count();
  let depts = [];
  if (deptCount === 0) {
    depts = await Department.bulkCreate([
      { name: 'Kitchen & Catering', code: 'KITCHEN', description: 'Culinary operations and kitchen staff' },
      { name: 'Human Resources', code: 'HR', description: 'People operations and compliance oversight' },
      { name: 'Engineering & IT', code: 'TECH', description: 'Software, infrastructure and technical support' },
      { name: 'Operations', code: 'OPS', description: 'Logistics, facilities, and service delivery' },
      { name: 'Sales & Marketing', code: 'SALES', description: 'Client partnerships and business growth' },
    ]);
  } else {
    depts = await Department.findAll();
  }

  // 3. Seed Visa Types
  const visaTypeCount = await VisaType.count();
  let visaTypes = [];
  if (visaTypeCount === 0) {
    visaTypes = await VisaType.bulkCreate([
      {
        name: 'Skilled Worker Visa',
        code: 'SKILLED_WORKER',
        category: 'Work Visa',
        requiresSponsorship: true,
        maxWeeklyHours: 48,
        description: 'Sponsored UK employment under Home Office license',
      },
      {
        name: 'Student Visa (20h Work Limit)',
        code: 'STUDENT_VISA',
        category: 'Study Visa',
        requiresSponsorship: false,
        maxWeeklyHours: 20,
        description: 'Term-time 20h per week limit / full-time in holidays',
      },
      {
        name: 'Graduate Visa (Post-Study)',
        code: 'GRADUATE_VISA',
        category: 'Post Study Work',
        requiresSponsorship: false,
        maxWeeklyHours: 40,
        description: '2-year unsponsored right to work',
      },
      {
        name: 'Indefinite Leave to Remain (ILR)',
        code: 'ILR_SETTLED',
        category: 'Settled Status',
        requiresSponsorship: false,
        maxWeeklyHours: 48,
        description: 'Permanent residency with unrestricted RTW',
      },
      {
        name: 'Youth Mobility Scheme',
        code: 'YOUTH_MOBILITY',
        category: 'Tier 5 Temporary',
        requiresSponsorship: false,
        maxWeeklyHours: 40,
        description: '2-year temporary work visa for participating nations',
      },
      {
        name: 'Spouse / Dependant Visa',
        code: 'SPOUSE_VISA',
        category: 'Family Visa',
        requiresSponsorship: false,
        maxWeeklyHours: 48,
        description: 'Dependant right to work linked to primary visa holder',
      },
      {
        name: 'British / Irish Citizen (Exempt)',
        code: 'BRITISH_CITIZEN',
        category: 'Citizen',
        requiresSponsorship: false,
        maxWeeklyHours: 48,
        description: 'Automatic right to work with British/Irish passport',
      },
    ]);
  } else {
    visaTypes = await VisaType.findAll();
  }

  // 4. Seed Employees
  const employeeCount = await Employee.count();
  if (employeeCount === 0) {
    const kitchenDept = depts.find(d => d.code === 'KITCHEN') || depts[0];
    const techDept = depts.find(d => d.code === 'TECH') || depts[0];
    const hrDept = depts.find(d => d.code === 'HR') || depts[0];
    const opsDept = depts.find(d => d.code === 'OPS') || depts[0];

    const employees = await Employee.bulkCreate([
      {
        employeeCode: 'EMP-001',
        firstName: 'Tariq',
        lastName: 'Ahmed',
        gender: 'Male',
        dateOfBirth: '1992-04-14',
        email: 'tariq.ahmed@example.com',
        phone: '+44 7700 900123',
        addressLine1: '42 High Street',
        addressLine2: 'Flat 3B',
        city: 'London',
        postcode: 'E1 6AN',
        country: 'United Kingdom',
        jobTitle: 'Head Chef',
        departmentId: kitchenDept.id,
        hireDate: '2023-01-15',
        startDate: '2023-02-01',
        salary: 42000.00,
        weeklyHours: 40.0,
        isSponsoredWorker: true,
        emergencyContact: 'Amina Ahmed (+44 7700 900124) - Spouse',
        nextOfKin: 'Amina Ahmed',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
      },
      {
        employeeCode: 'EMP-002',
        firstName: 'Elena',
        lastName: 'Rostova',
        gender: 'Female',
        dateOfBirth: '1996-08-22',
        email: 'elena.rostova@example.com',
        phone: '+44 7700 900456',
        addressLine1: '18 Victoria Road',
        addressLine2: 'Apartment 12',
        city: 'Manchester',
        postcode: 'M14 5TP',
        country: 'United Kingdom',
        jobTitle: 'Full Stack Engineer',
        departmentId: techDept.id,
        hireDate: '2023-06-10',
        startDate: '2023-07-01',
        salary: 58000.00,
        weeklyHours: 37.5,
        isSponsoredWorker: true,
        emergencyContact: 'Dmitri Rostov (+44 7700 900457) - Father',
        nextOfKin: 'Dmitri Rostov',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
      },
      {
        employeeCode: 'EMP-003',
        firstName: 'James',
        lastName: 'Wilson',
        gender: 'Male',
        dateOfBirth: '1988-11-03',
        email: 'james.wilson@example.com',
        phone: '+44 7700 900789',
        addressLine1: '7 Queens Avenue',
        city: 'Birmingham',
        postcode: 'B2 4QA',
        country: 'United Kingdom',
        jobTitle: 'HR Director',
        departmentId: hrDept.id,
        hireDate: '2022-03-01',
        startDate: '2022-03-15',
        salary: 65000.00,
        weeklyHours: 37.5,
        isSponsoredWorker: false,
        emergencyContact: 'Sarah Wilson (+44 7700 900780) - Wife',
        nextOfKin: 'Sarah Wilson',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
      },
      {
        employeeCode: 'EMP-004',
        firstName: 'Ananya',
        lastName: 'Patel',
        gender: 'Female',
        dateOfBirth: '2001-02-18',
        email: 'ananya.patel@example.com',
        phone: '+44 7700 900321',
        addressLine1: '95 Oxford Road',
        city: 'Reading',
        postcode: 'RG1 7UL',
        country: 'United Kingdom',
        jobTitle: 'Operations Assistant',
        departmentId: opsDept.id,
        hireDate: '2024-02-01',
        startDate: '2024-02-15',
        salary: 26000.00,
        weeklyHours: 20.0,
        isSponsoredWorker: false,
        emergencyContact: 'Raj Patel (+44 7700 900322) - Brother',
        nextOfKin: 'Raj Patel',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
      },
    ]);

    // 5. Seed Immigration Records & Right to Work
    const skilledVisa = visaTypes.find(v => v.code === 'SKILLED_WORKER') || visaTypes[0];
    const studentVisa = visaTypes.find(v => v.code === 'STUDENT_VISA') || visaTypes[1];
    const citizenVisa = visaTypes.find(v => v.code === 'BRITISH_CITIZEN') || visaTypes[6];

    // Tariq - Skilled Worker expiring in 45 days (Amber warning)
    const today = new Date();
    const expiry45Days = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const expiry180Days = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await ImmigrationRecord.bulkCreate([
      {
        employeeId: employees[0].id,
        visaTypeId: skilledVisa.id,
        passportNumber: 'GBR98432190',
        brpOrEvisaNumber: 'BRP992019482',
        issueDate: '2023-01-01',
        expiryDate: expiry45Days,
        shareCode: 'W87-29A-L90',
        sponsorCosNumber: 'COS-UK-2023-8910',
        documentUrl: '/docs/tariq_visa.pdf',
        status: 'EXPIRING_SOON',
        notes: 'CoS renewal requires initiation 30 days prior.',
      },
      {
        employeeId: employees[1].id,
        visaTypeId: skilledVisa.id,
        passportNumber: 'UKR87654321',
        brpOrEvisaNumber: 'EVISA-UKR-2023-01',
        issueDate: '2023-07-01',
        expiryDate: expiry180Days,
        shareCode: 'K91-88M-22Z',
        sponsorCosNumber: 'COS-UK-2023-4412',
        documentUrl: '/docs/elena_visa.pdf',
        status: 'VALID',
        notes: 'Compliant Skilled Worker.',
      },
      {
        employeeId: employees[3].id,
        visaTypeId: studentVisa.id,
        passportNumber: 'IND44556677',
        brpOrEvisaNumber: 'BRP88776655',
        issueDate: '2024-01-10',
        expiryDate: expiry180Days,
        shareCode: 'P33-99K-77T',
        status: 'VALID',
        notes: '20 hours term time strictly enforced.',
      },
    ]);

    // Right to Work checks
    await RightToWork.bulkCreate([
      {
        employeeId: employees[0].id,
        checkType: 'ONLINE_SHARE_CODE',
        checkDate: '2023-01-20',
        nextReviewDate: expiry45Days,
        verifiedBy: 'James Wilson (HR Director)',
        documentType: 'Online Home Office Share Code Check',
        documentRefNumber: 'W87-29A-L90',
        statutoryExcuseGranted: true,
        status: 'PENDING_REVIEW',
        notes: 'Follow-up check due upon visa extension.',
      },
      {
        employeeId: employees[1].id,
        checkType: 'ONLINE_SHARE_CODE',
        checkDate: '2023-06-25',
        nextReviewDate: expiry180Days,
        verifiedBy: 'James Wilson (HR Director)',
        documentType: 'Online Home Office Share Code Check',
        documentRefNumber: 'K91-88M-22Z',
        statutoryExcuseGranted: true,
        status: 'VERIFIED',
      },
      {
        employeeId: employees[2].id,
        checkType: 'MANUAL_DOCUMENT',
        checkDate: '2022-03-05',
        verifiedBy: 'Board of Directors',
        documentType: 'British Citizen Passport',
        documentRefNumber: 'GBR-P-112233',
        statutoryExcuseGranted: true,
        status: 'VERIFIED',
        notes: 'Continuous statutory excuse (Citizen).',
      },
      {
        employeeId: employees[3].id,
        checkType: 'ONLINE_SHARE_CODE',
        checkDate: '2024-02-05',
        nextReviewDate: expiry180Days,
        verifiedBy: 'James Wilson (HR Director)',
        documentType: 'Student Share Code Verification',
        documentRefNumber: 'P33-99K-77T',
        statutoryExcuseGranted: true,
        status: 'VERIFIED',
      },
    ]);

    // 6. Seed Leave Requests
    await LeaveRequest.bulkCreate([
      {
        employeeId: employees[0].id,
        leaveType: 'ANNUAL',
        startDate: '2026-10-10',
        endDate: '2026-10-17',
        totalDays: 5.0,
        reason: 'Family holiday in autumn',
        status: 'PENDING',
      },
      {
        employeeId: employees[1].id,
        leaveType: 'SICK',
        startDate: '2026-09-18',
        endDate: '2026-09-19',
        totalDays: 2.0,
        reason: 'Flu and fever',
        status: 'APPROVED',
        approvedBy: employees[2].id,
        approvedAt: new Date(),
        adminComments: 'Self-certification received.',
      },
    ]);

    // 7. Seed Admin User
    const adminRole = (await Role.findOne({ where: { name: 'Super Admin' } })) || { id: 1 };
    const passwordHash = await bcrypt.hash('admin123', 10);

    await User.create({
      employeeId: employees[2].id,
      name: 'System Administrator',
      email: 'admin@hrms.local',
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    });
  }

  return { success: true, message: 'HRMS Database initialized and seeded successfully.' };
}
