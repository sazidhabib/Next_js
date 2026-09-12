import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Project, initDb, cleanImageUrl } from '@/lib/models';

export async function GET(request) {
  try {
    await initDb();
    const projects = await Project.findAll({
      order: [['sortOrder', 'ASC']],
    });
    const sanitizedProjects = projects.map((proj) => ({
      ...proj.toJSON(),
      image: cleanImageUrl(proj.image),
    }));
    return NextResponse.json(sanitizedProjects);
  } catch (error) {
    console.error('Admin projects GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const body = await request.json();
    const { name, description, image, media, tags, features, sourceCodeLink, liveLink, sortOrder } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields: name, description' }, { status: 400 });
    }

    const newProject = await Project.create({
      name,
      description,
      image: image || '',
      media: media || [],
      tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
      features: Array.isArray(features) ? features : (features ? [features] : []),
      sourceCodeLink: sourceCodeLink || '',
      liveLink: liveLink || '',
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Admin projects POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const body = await request.json();
    const { id, name, description, image, media, tags, features, sourceCodeLink, liveLink, sortOrder } = body;

    if (!id || !name || !description) {
      return NextResponse.json({ error: 'Missing required fields: id, name, description' }, { status: 400 });
    }

    const project = await Project.findByPk(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await project.update({
      name,
      description,
      image: image || '',
      media: media || [],
      tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
      features: Array.isArray(features) ? features : (features ? [features] : []),
      sourceCodeLink: sourceCodeLink || '',
      liveLink: liveLink || '',
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Admin projects PUT error:', error);
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

    const deleted = await Project.destroy({ where: { id } });
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Admin projects DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
