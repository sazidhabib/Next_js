import { NextResponse } from 'next/server';
import { Experience, initDb, cleanImageUrl } from '@/lib/models';

export async function GET() {
  try {
    await initDb();
    const experiences = await Experience.findAll({
      order: [['sortOrder', 'ASC']],
    });

    const formatted = experiences.map((exp) => {
      let descArray = exp.description;
      if (typeof descArray === 'string') {
        try { descArray = JSON.parse(descArray); } catch (e) { descArray = [exp.description]; }
      }

      let skillsArray = exp.skills;
      if (typeof skillsArray === 'string') {
        try { skillsArray = JSON.parse(skillsArray); } catch (e) { skillsArray = []; }
      }

      return {
        id: exp.id,
        role: exp.role,
        company: exp.company,
        img: cleanImageUrl(exp.companyLogo),
        date: exp.date,
        desc: descArray || [],
        skills: skillsArray || [],
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Public experiences fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
