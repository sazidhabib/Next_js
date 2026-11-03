import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Technology, initDb, cleanImageUrl } from '@/lib/models';

const defaultTechnologies = [
  { name: "HTML 5", icon: "/src/assets/tech/html.png", sortOrder: 0 },
  { name: "CSS 3", icon: "/src/assets/tech/css.png", sortOrder: 1 },
  { name: "JavaScript", icon: "/src/assets/tech/javascript.png", sortOrder: 2 },
  { name: "TypeScript", icon: "/src/assets/tech/typescript.png", sortOrder: 3 },
  { name: "React JS", icon: "/src/assets/tech/reactjs.png", sortOrder: 4 },
  { name: "Redux Toolkit", icon: "/src/assets/tech/redux.png", sortOrder: 5 },
  { name: "Tailwind CSS", icon: "/src/assets/tech/tailwind.png", sortOrder: 6 },
  { name: "Node JS", icon: "/src/assets/tech/nodejs.png", sortOrder: 7 },
  { name: "MongoDB", icon: "/src/assets/tech/mongodb.png", sortOrder: 8 },
  { name: "Three JS", icon: "/src/assets/tech/threejs.png", sortOrder: 9 },
  { name: "git", icon: "/src/assets/tech/git.png", sortOrder: 10 },
  { name: "figma", icon: "/src/assets/tech/figma.png", sortOrder: 11 },
  { name: "docker", icon: "/src/assets/tech/docker.png", sortOrder: 12 },
];

export async function GET() {
  try {
    await initDb();
    let items = await Technology.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });

    // Auto-populate initial 13 technologies if table is empty
    if (!items || items.length === 0) {
      await Technology.bulkCreate(defaultTechnologies);
      items = await Technology.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'ASC'],
        ],
      });
    }

    const sanitized = items.map((tech) => ({
      ...tech.toJSON(),
      icon: cleanImageUrl(tech.icon),
    }));
    return NextResponse.json(sanitized);
  } catch (error) {
    console.warn('Database error fetching admin technologies, returning default list:', error.message);
    const fallback = defaultTechnologies.map((t, index) => ({
      id: index + 1,
      name: t.name,
      icon: cleanImageUrl(t.icon),
      sortOrder: t.sortOrder,
    }));
    return NextResponse.json(fallback);
  }
}

export async function POST(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const body = await request.json();

    // Support one-click bulk seed action from admin UI
    if (body.action === 'seed') {
      await Technology.destroy({ where: {} });
      await Technology.bulkCreate(defaultTechnologies);
      const items = await Technology.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'ASC'],
        ],
      });
      return NextResponse.json(items.map((tech) => ({
        ...tech.toJSON(),
        icon: cleanImageUrl(tech.icon),
      })));
    }

    const { name, icon, sortOrder } = body;

    if (!name || !icon) {
      return NextResponse.json({ error: 'Missing required fields: name, icon' }, { status: 400 });
    }

    const newTech = await Technology.create({
      name,
      icon,
      sortOrder: sortOrder !== undefined && sortOrder !== null ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(newTech, { status: 201 });
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
    const { id, name, icon, sortOrder } = await request.json();

    if (!id || !name || !icon) {
      return NextResponse.json({ error: 'Missing required fields: id, name, icon' }, { status: 400 });
    }

    const tech = await Technology.findByPk(id);
    if (!tech) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    await tech.update({
      name,
      icon,
      sortOrder: sortOrder !== undefined && sortOrder !== null ? parseInt(sortOrder) : 0,
    });

    return NextResponse.json(tech);
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

    await Technology.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Technology deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
