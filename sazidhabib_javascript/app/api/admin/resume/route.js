import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Setting, initDb, cleanImageUrl } from '@/lib/models';

const DEFAULT_RESUME = {
  resumeUrl: '/Mahbub_Sazid_Habib_Resume.pdf',
  resumeFilename: 'Mahbub_Sazid_Habib_Resume.pdf',
};

export async function GET(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const urlSetting = await Setting.findByPk('resume_url');
    const nameSetting = await Setting.findByPk('resume_filename');

    const resumeUrl = urlSetting?.value ? cleanImageUrl(urlSetting.value) : DEFAULT_RESUME.resumeUrl;
    const resumeFilename = nameSetting?.value || DEFAULT_RESUME.resumeFilename;
    const updatedAt = urlSetting?.updatedAt || nameSetting?.updatedAt || null;

    return NextResponse.json({
      resumeUrl,
      resumeFilename,
      updatedAt,
      isDefault: !urlSetting?.value,
    });
  } catch (error) {
    console.warn('Database error fetching admin resume setting:', error.message);
    return NextResponse.json({
      ...DEFAULT_RESUME,
      updatedAt: null,
      isDefault: true,
    });
  }
}

export async function PUT(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { resumeUrl, resumeFilename } = await request.json();

    if (!resumeUrl) {
      return NextResponse.json({ error: 'Missing required field: resumeUrl' }, { status: 400 });
    }

    const cleanUrl = cleanImageUrl(resumeUrl.trim());
    const cleanFilename = (resumeFilename || 'Resume.pdf').trim();

    await Setting.upsert({
      key: 'resume_url',
      value: cleanUrl,
    });

    await Setting.upsert({
      key: 'resume_filename',
      value: cleanFilename,
    });

    return NextResponse.json({
      success: true,
      message: 'Resume updated successfully!',
      resumeUrl: cleanUrl,
      resumeFilename: cleanFilename,
    });
  } catch (error) {
    console.error('Error updating resume setting:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  return PUT(request);
}

