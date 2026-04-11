import { NextResponse } from 'next/server';
import Section from '@/lib/models/sections';

export async function GET() {
    try {
        const sections = await Section.findAll({
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(sections, { status: 200 });
    } catch (error) {
        console.error("Get Sections Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
