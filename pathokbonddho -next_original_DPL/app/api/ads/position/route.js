import { NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';
import Ad from '@/lib/models/ad-model';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const position = searchParams.get('position');
        const page = searchParams.get('page');

        if (!position) {
            return NextResponse.json({ message: "Position is required" }, { status: 400 });
        }

        const now = new Date();
        const whereClause = {
            position,
            isActive: true,
            [Op.and]: [
                {
                    [Op.or]: [
                        { startDate: null },
                        { startDate: { [Op.lte]: now } }
                    ]
                },
                {
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: now } }
                    ]
                },
                {
                    [Op.or]: [
                        { maxImpressions: null },
                        { currentImpressions: { [Op.lt]: Sequelize.col('maxImpressions') } }
                    ]
                }
            ]
        };

        // If page is specified, check displayPages
        if (page) {
            whereClause[Op.or] = [
                { displayPages: null },
                { displayPages: "" },
                { displayPages: "[]" },
                { displayPages: { [Op.like]: `%all%` } },
                { displayPages: { [Op.like]: `%${page}%` } }
            ];
        }

        const ads = await Ad.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]]
        });

        const adsWithParsedPages = ads.map(ad => {
            const adData = ad.toJSON();
            if (adData.displayPages) {
                try {
                    adData.displayPages = JSON.parse(adData.displayPages);
                } catch (error) {
                    adData.displayPages = [];
                }
            } else {
                adData.displayPages = [];
            }
            return adData;
        });

        return NextResponse.json(adsWithParsedPages, { status: 200 });
    } catch (error) {
        console.error("Get Ads By Position Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
