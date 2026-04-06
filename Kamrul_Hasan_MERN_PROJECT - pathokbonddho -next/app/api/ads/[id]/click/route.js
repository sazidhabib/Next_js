import { NextResponse } from 'next/server';
import Ad from '@/lib/models/ad-model';

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const ad = await Ad.findByPk(id);

        if (!ad) {
            return NextResponse.json({ message: "Ad Not Found" }, { status: 404 });
        }

        await ad.increment('clickCount');
        return NextResponse.json({ message: "Click recorded" }, { status: 200 });
    } catch (error) {
        console.error("Record Click Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
