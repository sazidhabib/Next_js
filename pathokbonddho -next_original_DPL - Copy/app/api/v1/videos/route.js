import { NextResponse } from 'next/server';
import Videos from '@/lib/models/videos';

export async function GET() {
    try {
        const videos = await Videos.findAll({
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        console.error("Get Videos Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
