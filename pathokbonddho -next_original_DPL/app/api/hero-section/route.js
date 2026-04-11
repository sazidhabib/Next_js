import { NextResponse } from 'next/server';
import HeroSection from '@/lib/models/heroSections';

export async function GET() {
    try {
        const heroSections = await HeroSection.findAll({
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(heroSections, { status: 200 });
    } catch (error) {
        console.error("Get Hero Sections Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
