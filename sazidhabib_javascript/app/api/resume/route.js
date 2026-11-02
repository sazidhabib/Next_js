import { NextResponse } from 'next/server';
import { Setting, initDb, cleanImageUrl } from '@/lib/models';

const DEFAULT_RESUME = {
  resumeUrl: '/Mahbub_Sazid_Habib_Resume.pdf',
  resumeFilename: 'Mahbub_Sazid_Habib_Resume.pdf',
};

export async function GET() {
  try {
    await initDb();
    const urlSetting = await Setting.findByPk('resume_url');
    const nameSetting = await Setting.findByPk('resume_filename');

    const resumeUrl = urlSetting?.value ? cleanImageUrl(urlSetting.value) : DEFAULT_RESUME.resumeUrl;
    const resumeFilename = nameSetting?.value || DEFAULT_RESUME.resumeFilename;

    return NextResponse.json({
      resumeUrl,
      resumeFilename,
    });
  } catch (error) {
    console.warn('Database error fetching resume setting, using fallback:', error.message);
    return NextResponse.json(DEFAULT_RESUME);
  }
}

