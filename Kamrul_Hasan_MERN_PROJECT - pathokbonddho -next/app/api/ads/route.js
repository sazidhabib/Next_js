import { NextResponse } from 'next/server';
import Ad from '@/lib/models/ad-model';

export async function GET() {
    try {
        const ads = await Ad.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(ads, { status: 200 });
    } catch (error) {
        console.error("Get Ads Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
