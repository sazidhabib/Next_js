import { NextResponse } from 'next/server';
import { Skill, initDb, cleanImageUrl } from '@/lib/models';

export async function GET() {
  try {
    await initDb();
    const skills = await Skill.findAll({
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
      ],
    });

    const categoriesMap = {};
    skills.forEach((skill) => {
      if (!categoriesMap[skill.category]) {
        categoriesMap[skill.category] = [];
      }
      categoriesMap[skill.category].push({
        id: skill.id,
        name: skill.name,
        image: cleanImageUrl(skill.image),
      });
    });

    const formattedSkills = Object.keys(categoriesMap).map((category) => ({
      title: category,
      skills: categoriesMap[category],
    }));

    return NextResponse.json(formattedSkills);
  } catch (error) {
    console.error('Public skills fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
