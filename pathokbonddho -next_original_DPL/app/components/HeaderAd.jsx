"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import api from '@/app/lib/api';

const HeaderAd = () => {
    const pathname = usePathname();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdminPage = useMemo(() => {
        if (!pathname) return false;
        return pathname.startsWith('/admin') || pathname.startsWith('/login');
    }, [pathname]);

    // Detect current page context
    const currentPage = useMemo(() => {
        if (!pathname) return 'home';
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/news/')) return 'details';
        if (pathname.split('/')[1]) return 'section';
        return 'unknown';
    }, [pathname]);

    const pageSlug = useMemo(() => {
        if (!pathname || pathname === '/') return 'home';
        if (pathname.startsWith('/news/')) return 'details';
        return pathname.split('/')[1] || 'unknown';
    }, [pathname]);

    useEffect(() => {
        if (isAdminPage) {
            setLoading(false);
            return;
        }

        const fetchHeaderAd = async () => {
            try {
                const response = await api.get('/ads/position', {
                    params: { position: 'header' }
                });

                const ads = response.data || [];
                if (ads.length > 0) {
                    const activeAd = ads[0];

                    let displayPages = activeAd.displayPages || [];
                    if (typeof displayPages === 'string') {
                        try { displayPages = JSON.parse(displayPages); } catch (e) { displayPages = []; }
                    }

                    const shouldShow =
                        displayPages.includes('all') ||
                        displayPages.length === 0 ||
                        displayPages.includes(currentPage) ||
                        displayPages.includes(pageSlug);

                    if (shouldShow) {
                        setAd(activeAd);
                        api.post(`/ads/${activeAd.id || activeAd._id}/impression`).catch(() => { });
                    }
                }
            } catch (err) {
                console.error('Error fetching header ad:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderAd();
    }, [pathname, currentPage, pageSlug, isAdminPage]);

    const handleAdClick = () => {
        if (ad) {
            api.post(`/ads/${ad.id || ad._id}/click`).catch(() => { });
        }
    };

    if (loading || !ad) return null;

    const adImage = ad.image;
    const adTitle = ad.title || ad.name || 'Advertisement';
    const adLink = ad.imageUrl || ad.link || ad.url || '#';

    const imgSrc = adImage
        ? (() => {
            const rawUrl = adImage.startsWith('http') ? adImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/ads/${adImage}`;
            if (rawUrl.startsWith('http')) {
                const isLocal = rawUrl.includes('127.0.0.1') || rawUrl.includes('localhost');
                if (isLocal) return rawUrl;
                return rawUrl.replace(/^http:\/\//, 'https://');
            }
            return rawUrl;
        })()
        : null;

    return (
        <div className="header-ad-container  text-center pt-2" style={{ backgroundColor: '#ffffffff' }}>
            <div className="container">
                {ad.type === 'google_adsense' ? (
                    <div className="google-ad-container mx-auto">
                        {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                        {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
                    </div>
                ) : (
                    imgSrc && (
                        <a href={adLink} target="_blank" rel="noopener noreferrer" onClick={handleAdClick} className="d-inline-block">
                            <Image
                                src={imgSrc}
                                alt={adTitle}
                                width={1280}
                                height={50}
                                className="img-fluid"
                                style={{ objectFit: 'contain', maxHeight: '90px', width: 'auto' }}
                                priority
                            />
                        </a>
                    )
                )}
            </div>
        </div>
    );
};

export default HeaderAd;
