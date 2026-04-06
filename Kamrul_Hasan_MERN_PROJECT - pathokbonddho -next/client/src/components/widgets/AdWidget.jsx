import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AdWidget = ({ cell }) => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Detect current page context
    const currentPage = useMemo(() => {
        const path = window.location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/news/')) return 'details';
        return path.split('/')[1] || 'unknown';
    }, []);

    // Parse displayPages from the ad data
    const displayPages = useMemo(() => {
        if (!ad || !ad.displayPages) return [];
        let pages = ad.displayPages;
        if (typeof pages === 'string') {
            try {
                pages = JSON.parse(pages);
                // Handle double-stringified arrays
                if (typeof pages === 'string') {
                    pages = JSON.parse(pages);
                }
            } catch (e) {
                console.warn('Could not parse displayPages:', ad.displayPages);
                return [];
            }
        }
        return Array.isArray(pages) ? pages : [];
    }, [ad]);

    // Check if ad should be visible on current page
    const shouldShowAd = useMemo(() => {
        if (!ad) return false;

        // Special rule: "details" page MUST be explicitly selected
        if (currentPage === 'details') {
            return displayPages.includes('details');
        }

        // No displayPages set = show on ALL pages (except details, handled above)
        if (displayPages.length === 0) return true;

        // "none" means don't show anywhere
        if (displayPages.includes('none')) return false;

        // Check if current page is in the allowed list
        return displayPages.includes(currentPage);
    }, [ad, displayPages, currentPage]);

    // Fetch ad data
    useEffect(() => {
        const fetchAd = async () => {
            if (!cell.contentId) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/api/ads/${cell.contentId}`);
                setAd(response.data.data || response.data);
            } catch (err) {
                console.error('Error fetching ad widget data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [cell.contentId, API_BASE_URL]);

    // Fire impression tracking when ad renders and is visible
    useEffect(() => {
        if (ad && ad.id && shouldShowAd) {
            axios.post(`${API_BASE_URL}/api/ads/${ad.id}/impression`).catch(() => { });
        }
    }, [ad, API_BASE_URL, shouldShowAd]);

    // --- All hooks are above, conditional returns below ---

    if (loading) {
        return (
            <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!ad) return null;

    // Don't render if ad is not meant for this page
    if (!shouldShowAd) return null;

    const adImage = ad.image;
    const adTitle = ad.title || ad.name || cell.contentTitle || 'Advertisement';
    const adLink = ad.imageUrl || ad.link || ad.url || '#';
    const imgSrc = adImage
        ? (adImage.startsWith('http') ? adImage : `${API_BASE_URL}/uploads/ads/${adImage}`)
        : null;

    if (ad.type === 'google_adsense') {
        return (
            <div className="ad-widget h-100 w-100 d-flex flex-column align-items-center justify-content-center overflow-hidden">
                {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
            </div>
        );
    }

    const content = (
        <div className="ad-widget h-100 overflow-hidden" style={{ backgroundColor: '#ffffffff' }}>
            {imgSrc && (
                <div style={{ overflow: 'hidden' }}>
                    <img
                        src={imgSrc}
                        alt={adTitle}
                        className="w-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}
        </div>
    );

    // Wrap in a link if URL exists
    if (adLink && adLink !== '#') {
        return (
            <a
                href={adLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                onClick={() => {
                    if (ad && ad.id) {
                        axios.post(`${API_BASE_URL}/api/ads/${ad.id}/click`).catch(() => { });
                    }
                }}
            >
                {content}
            </a>
        );
    }

    return content;
};

export default AdWidget;
