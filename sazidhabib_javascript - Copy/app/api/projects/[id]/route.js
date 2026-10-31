import { NextResponse } from 'next/server';
import { Project, initDb, cleanImageUrl } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const proj = await Project.findByPk(id);

    if (!proj) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let tagsObj = [];
    try {
      tagsObj = typeof proj.tags === 'string' ? JSON.parse(proj.tags) : proj.tags;
    } catch (e) {
      tagsObj = proj.tags || [];
    }

    let mediaObj = [];
    try {
      mediaObj = typeof proj.media === 'string' ? JSON.parse(proj.media) : proj.media;
    } catch (e) {
      mediaObj = proj.media || [];
    }

    let featuresObj = [];
    try {
      featuresObj = typeof proj.features === 'string' ? JSON.parse(proj.features) : proj.features;
    } catch (e) {
      featuresObj = proj.features || [];
    }

    const cleanedImg = cleanImageUrl(proj.image);
    if ((!mediaObj || mediaObj.length === 0) && cleanedImg) {
      mediaObj = [{ type: 'image', src: cleanedImg }];
    }

    const formatted = {
      id: proj.id,
      name: proj.name,
      description: proj.description,
      image: cleanedImg,
      tags: tagsObj || [],
      features: featuresObj || [],
      source_code_link: proj.sourceCodeLink,
      live_link: proj.liveLink,
      media: mediaObj || [],
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch single project error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
