import { NextResponse } from 'next/server';
import Song from '@/lib/models/song';

export async function GET() {
    try {
        const songs = await Song.findAll({
            order: [['position', 'ASC'], ['createdAt', 'DESC']]
        });

        return NextResponse.json(songs, { status: 200 });
    } catch (error) {
        console.error("Get Songs Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
