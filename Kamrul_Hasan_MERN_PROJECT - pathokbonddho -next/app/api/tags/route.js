import { NextResponse } from 'next/server';
import Tag from '@/lib/models/tag-model';

export async function GET() {
    try {
        const tags = await Tag.findAll({
            where: { status: true },
            order: [['name', 'ASC']]
        });

        return NextResponse.json(tags, { status: 200 });
    } catch (error) {
        console.error("Get Tags Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
