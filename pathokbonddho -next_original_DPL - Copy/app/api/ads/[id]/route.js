import { NextResponse } from 'next/server';
import Ad from '@/lib/models/ad-model';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const ad = await Ad.findByPk(id);

        if (!ad) {
            return NextResponse.json({ message: "Ad Not Found" }, { status: 404 });
        }

        const adData = ad.toJSON();
        if (adData.displayPages) {
            try {
                adData.displayPages = JSON.parse(adData.displayPages);
            } catch (error) {
                adData.displayPages = [];
            }
        }

        return NextResponse.json(adData, { status: 200 });
    } catch (error) {
        console.error("Get Ad Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
