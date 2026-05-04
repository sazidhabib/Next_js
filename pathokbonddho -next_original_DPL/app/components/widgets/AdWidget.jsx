"use client";
import React, { useState, useEffect, useMemo } from 'react';
import api from '@/app/lib/api';
import { usePathname } from 'next/navigation';
import NextImage from 'next/image';

const AdWidget = ({ cell, isPriority }) => {
    const pathname = usePathname();
    const [ad, setAd] = useState(cell.resolvedContent || null);
    const [loading, setLoading] = useState(!cell.resolvedContent);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Detect current page context reactively
    const currentPage = useMemo(() => {
        if (!pathname) return 'home';
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/news/')) return 'details';
        // If it's not home or details, and has a path, it's a section
        if (pathname.split('/')[1]) return 'section';
        return 'unknown';
    }, [pathname]);

    // Track the specific slug for targeted section ads
    const pageSlug = useMemo(() => {
        if (!pathname || pathname === '/') return 'home';
        if (pathname.startsWith('/news/')) return 'details';
        return pathname.split('/')[1] || 'unknown';
    }, [pathname]);

    // Parse displayPages from the ad data
    const displayPages = useMemo(() => {
        if (!ad || !ad.displayPages) return [];
        let pages = ad.displayPages;
        if (typeof pages === 'string') {
            try {
                pages = JSON.parse(pages);
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

    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!ad) return;
        const now = new Date();
        if (ad.startDate && new Date(ad.startDate) > now) {
            setIsExpired(true);
        } else if (ad.endDate && new Date(ad.endDate) < now) {
            setIsExpired(true);
        } else if (ad.maxImpressions && ad.currentImpressions >= ad.maxImpressions) {
            setIsExpired(true);
        } else {
            setIsExpired(false);
        }
    }, [ad]);

    // Check if ad should be visible on current page
    const shouldShowAd = useMemo(() => {
        if (!ad) return false;

        // 0. Check validity (active, unexpired, impression limit not reached)
        if (ad.isActive === false) return false;
        if (isExpired) return false;

        // 1. If 'all' is selected, show it everywhere
        if (displayPages.includes('all')) return true;

        // 2. If 'none' or empty, default to show if no other rules apply (backward compatibility)
        if (displayPages.includes('none')) return false;
        if (displayPages.length === 0) return true;

        // 3. Match by context (home, details, section)
        if (displayPages.includes(currentPage)) return true;

        // 4. Match by specific slug (for targeted section ads)
        if (displayPages.includes(pageSlug)) return true;

        return false;
    }, [ad, displayPages, currentPage, pageSlug, isExpired]);


    // Fetch ad data if not provided by server
    useEffect(() => {
        if (cell.resolvedContent) {
            setAd(cell.resolvedContent);
            setLoading(false);
            return;
        }

        const fetchAd = async () => {
            if (!cell.contentId) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/ads/${cell.contentId}`);
                setAd(response.data.data || response.data);
            } catch (err) {
                console.error('Error fetching ad widget data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [cell.contentId, cell.resolvedContent, API_BASE_URL]);

    // Fire impression tracking
    useEffect(() => {
        if (ad && ad.id && shouldShowAd) {
            api.post(`/ads/${ad.id}/impression`).catch(() => { });
        }
    }, [ad, API_BASE_URL, shouldShowAd]);

    if (loading && !ad) {
        return <div className="text-center p-3 animate-pulse bg-light rounded" style={{ height: '100px' }}></div>;
    }

    if (!ad || !shouldShowAd || isExpired) return null;

    const adImage = ad.image;
    const adTitle = ad.title || ad.name || cell.contentTitle || 'Advertisement';
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

    if (ad.type === 'google_adsense') {
        return (
            <div className="ad-widget h-100 w-100 d-flex flex-column align-items-center justify-content-center overflow-hidden">
                {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
            </div>
        );
    }

    const content = (
        <div
            className="ad-widget w-100 overflow-hidden position-relative"
            style={{
                // backgroundColor: '#f8f9fa', 
                minHeight: '250px',
                height: '100%',
                display: 'block'
            }}
        >
            {imgSrc ? (
                <NextImage
                    src={imgSrc}
                    alt={adTitle}
                    fill
                    className="w-100 h-100"
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={isPriority !== undefined ? isPriority : (currentPage === 'home')}
                />
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                    Advertisement
                </div>
            )}
        </div>
    );


    if (adLink && adLink !== '#') {
        return (
            <a
                href={adLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                onClick={() => {
                    if (ad && ad.id) {
                        api.post(`/ads/${ad.id}/click`).catch(() => { });
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
