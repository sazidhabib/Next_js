import { NextResponse } from 'next/server';
import Section from '@/lib/models/sections';

export async function GET(req, { params }) {
    try {
        const { type } = await params;
        const section = await Section.findOne({ where: { type } });

        if (!section) {
            return NextResponse.json({ message: "Section Not Found" }, { status: 404 });
        }

        return NextResponse.json(section, { status: 200 });
    } catch (error) {
        console.error("Get Section by Type Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
