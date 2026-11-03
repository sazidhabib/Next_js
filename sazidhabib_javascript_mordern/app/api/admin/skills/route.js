import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Skill, initDb, cleanImageUrl } from '@/lib/models';

export async function GET(request) {
  try {
    await initDb();
    const skills = await Skill.findAll({
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
      ],
    });
    const sanitizedSkills = skills.map((skill) => ({
      ...skill.toJSON(),
      image: cleanImageUrl(skill.image),
    }));
    return NextResponse.json(sanitizedSkills);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { category, name, image, sortOrder } = await request.json();

    if (!category || !name || !image) {
      return NextResponse.json({ error: 'Missing required fields: category, name, image' }, { status: 400 });
    }

    const newSkill = await Skill.create({
      category,
      name,
      image,
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { id, category, name, image, sortOrder } = await request.json();

    if (!id || !category || !name || !image) {
      return NextResponse.json({ error: 'Missing required fields: id, category, name, image' }, { status: 400 });
    }

    const skill = await Skill.findByPk(id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await skill.update({
      category,
      name,
      image,
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
    }

    await Skill.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
