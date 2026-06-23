// utils/ad-renderer.js
const Ad = require("../models/ad-model");
const { Op } = require("sequelize");

class AdRenderer {
    // Get ads for specific position and page
    static async getAds(position, page = null) {
        try {
            const whereClause = {
                position,
                isActive: true,
                [Op.and]: [
                    {
                        [Op.or]: [
                            { startDate: null },
                            { startDate: { [Op.lte]: new Date() } }
                        ]
                    },
                    {
                        [Op.or]: [
                            { endDate: null },
                            { endDate: { [Op.gte]: new Date() } }
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
                    { displayPages: { [Op.like]: `%${page}%` } }
                ];
            }

            const ads = await Ad.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]]
            });

            return ads.map(ad => {
                const adData = ad.toJSON();
                if (adData.displayPages) {
                    try {
                        adData.displayPages = JSON.parse(adData.displayPages);
                    } catch (error) {
                        adData.displayPages = [];
                    }
                }
                return adData;
            });
        } catch (error) {
            console.error("AdRenderer Error:", error);
            return [];
        }
    }

    // Render ad HTML
    static renderAd(ad) {
        if (ad.type === 'image') {
            return `
                <div class="ad-container" data-ad-id="${ad.id}">
                    <a href="/ads/click/${ad.id}" target="_blank" onclick="recordAdClick(${ad.id})">
                        <img src="/uploads/ads/${ad.image}" alt="${ad.name}" style="max-width: 100%; height: auto;">
                    </a>
                </div>
            `;
        } else if (ad.type === 'google_adsense') {
            return `
                <div class="ad-container" data-ad-id="${ad.id}">
                    ${ad.headCode || ''}
                    ${ad.bodyCode || ''}
                </div>
            `;
        }
        return '';
    }

    // Render all ads for a position
    static async renderAds(position, page = null) {
        const ads = await this.getAds(position, page);
        return ads.map(ad => this.renderAd(ad)).join('');
    }
}

module.exports = AdRenderer;