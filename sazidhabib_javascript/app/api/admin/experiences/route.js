import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Experience, initDb, cleanImageUrl } from '@/lib/models';

export async function GET(request) {
  try {
    await initDb();
    const experiences = await Experience.findAll({
      order: [['sortOrder', 'ASC']],
    });
    const sanitizedExperiences = experiences.map((exp) => ({
      ...exp.toJSON(),
      companyLogo: cleanImageUrl(exp.companyLogo),
    }));
    return NextResponse.json(sanitizedExperiences);
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
    const { role, company, companyLogo, date, description, skills, sortOrder } = await request.json();

    if (!role || !company || !date) {
      return NextResponse.json({ error: 'Missing required fields: role, company, date' }, { status: 400 });
    }

    const newExp = await Experience.create({
      role,
      company,
      companyLogo: companyLogo || '',
      date,
      description: Array.isArray(description) ? description : (description ? [description] : []),
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(newExp, { status: 201 });
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
    const { id, role, company, companyLogo, date, description, skills, sortOrder } = await request.json();

    if (!id || !role || !company || !date) {
      return NextResponse.json({ error: 'Missing required fields: id, role, company, date' }, { status: 400 });
    }

    const exp = await Experience.findByPk(id);
    if (!exp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    await exp.update({
      role,
      company,
      companyLogo: companyLogo || '',
      date,
      description: Array.isArray(description) ? description : (description ? [description] : []),
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(exp);
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

    await Experience.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
