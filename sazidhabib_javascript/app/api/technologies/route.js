import { NextResponse } from 'next/server';
import { Technology, initDb, cleanImageUrl } from '@/lib/models';
import { technologies as fallbackTechnologies } from '@/constants/index';

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

    if (!items || items.length === 0) {
      try {
        await Technology.bulkCreate(defaultTechnologies);
        items = await Technology.findAll({
          order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'ASC'],
          ],
        });
      } catch (e) {
        return NextResponse.json(fallbackTechnologies);
      }
    }

    const sanitized = items.map((tech) => ({
      id: tech.id,
      name: tech.name,
      icon: cleanImageUrl(tech.icon),
      sortOrder: tech.sortOrder,
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    console.warn('Technologies fetch error, using fallback:', error.message);
    return NextResponse.json(fallbackTechnologies);
  }
}
