import { NextResponse } from 'next/server';
import { initDb, Setting } from '@/lib/db/models/index';

const DEFAULT_SETTINGS = {
  appName: 'HRMS Pro',
  appSubtitle: 'Enterprise Compliance',
  companyName: 'The Royal Kitchen Hospitality Ltd',
  appLogo: '',
  sponsorLicenceNo: '0W01ABC89',
  complianceOfficer: 'James Wilson',
  complianceEmail: 'compliance@hrms.local',
  currencySymbol: '£',
  visaWarningDays: 90,
  rtwWarningDays: 30,
};

export async function GET() {
  try {
    await initDb();
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(DEFAULT_SETTINGS);
    }
    return NextResponse.json({ success: true, settings: setting });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await initDb();
    const body = await request.json();

    // Check user role from headers or body if passed
    // (If role is provided and not Super Admin / Admin, reject)
    const requesterRole = request.headers.get('x-user-role') || body.requesterRole;
    if (requesterRole && !['Super Admin', 'Admin'].includes(requesterRole)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Super Admin can change system settings' },
        { status: 403 }
      );
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ ...DEFAULT_SETTINGS, ...body });
    } else {
      await setting.update(body);
    }

    return NextResponse.json({
      success: true,
      message: 'System settings saved successfully',
      settings: setting,
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
