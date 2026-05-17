"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import api from '@/app/lib/api';
import dynamic from 'next/dynamic';
import { useSettings } from '@/app/providers/SettingsProvider';

const ConfettiSideCannons = dynamic(() => import('./ConfettiSideCannons'), { ssr: false });
const ConfettiFireworks = dynamic(() => import('./ConfettiFireworks'), { ssr: false });

const PopupAd = () => {
    const { settings } = useSettings();
    const pathname = usePathname();
    const [ad, setAd] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null); // visible countdown in seconds
    const [showCannons, setShowCannons] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const autoCloseTimer = useRef(null);
    const countdownInterval = useRef(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Don't show popup ads on admin/backend pages
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

    // Clear all timers
    const clearTimers = useCallback(() => {
        if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
            autoCloseTimer.current = null;
        }
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
    }, []);

    // Start the auto-close countdown
    const startAutoClose = useCallback((seconds) => {
        clearTimers();
        setCountdown(seconds);

        // Countdown tick every second
        countdownInterval.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current);
                    countdownInterval.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-close after the full duration
        autoCloseTimer.current = setTimeout(() => {
            // Directly close instead of calling handleClose to avoid stale closure
            if (autoCloseTimer.current) {
                clearTimeout(autoCloseTimer.current);
                autoCloseTimer.current = null;
            }
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
            }
            setShow(false);
            setCountdown(null);
        }, seconds * 1000);
    }, [clearTimers]);

    useEffect(() => {
        // Skip fetching popup ads on admin pages
        if (isAdminPage) {
            setLoading(false);
            return;
        }

        const fetchPopupAd = async () => {
            try {
                // Fetch ads specifically for the popup position
                const response = await api.get('/ads/position', {
                    params: { position: 'popup' }
                });

                const ads = response.data || [];
                if (ads.length > 0) {
                    // Just take the first active one for now, or randomize
                    const activeAd = ads[0];

                    // Parse displayPages
                    let displayPages = activeAd.displayPages || [];
                    if (typeof displayPages === 'string') {
                        try {
                            displayPages = JSON.parse(displayPages);
                        } catch (e) {
                            displayPages = [];
                        }
                    }

                    // Check if it should show on this page
                    const shouldShow =
                        displayPages.includes('all') ||
                        displayPages.length === 0 ||
                        displayPages.includes(currentPage) ||
                        displayPages.includes(pageSlug);

                    if (shouldShow) {
                        const adId = activeAd.id || activeAd._id;
                        const maxShowCount = activeAd.popupMaxShowCount || 1; // default: show once per session
                        const sessionKey = `popup_ad_show_count_${adId}`;

                        // Get current show count from sessionStorage
                        const currentShowCount = parseInt(sessionStorage.getItem(sessionKey) || '0', 10);

                        if (currentShowCount < maxShowCount) {
                            setAd(activeAd);
                            // Small delay before showing the popup
                            setTimeout(() => {
                                setShow(true);
                                setShowCannons(true);
                                setTimeout(() => {
                                    setShowFireworks(true);
                                }, 6000);
                                // Increment the show count
                                sessionStorage.setItem(sessionKey, String(currentShowCount + 1));
                                // Record impression
                                api.post(`/ads/${adId}/impression`).catch(() => { });

                                // Start auto-close timer if configured
                                const autoCloseSeconds = activeAd.popupAutoCloseSeconds;
                                if (autoCloseSeconds && autoCloseSeconds > 0) {
                                    startAutoClose(autoCloseSeconds);
                                }
                            }, 3000);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching popup ad:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPopupAd();

        // Cleanup timers on unmount or pathname change
        return () => clearTimers();
    }, [pathname, currentPage, pageSlug, startAutoClose, clearTimers, isAdminPage]);

    const handleClose = () => {
        clearTimers();
        setShow(false);
        setCountdown(null);
    };

    const handleAdClick = () => {
        if (ad) {
            api.post(`/ads/${ad.id || ad._id}/click`).catch(() => { });
            handleClose();
        }
    };

    if (!ad) return null;

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

    // Calculate countdown progress for the visual bar
    const autoCloseTotal = ad.popupAutoCloseSeconds;
    const progressPercent = autoCloseTotal && countdown !== null
        ? (countdown / autoCloseTotal) * 100
        : null;

    return (
        <>
            {settings?.enableConfetti !== false && showCannons && (
                <ConfettiSideCannons triggerOnLoad={true} duration={3000} />
            )}
            {settings?.enableConfetti !== false && showFireworks && (
                <ConfettiFireworks triggerOnLoad={true} duration={10000} />
            )}
            <style jsx global>{`
                .popup-ad-modal .modal-dialog {
                    max-width: fit-content;
                    margin: 1.75rem auto;
                }
                .popup-ad-modal .modal-content {
                    border: none;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.3);
                    width: auto;
                    display: inline-block;
                }
                .popup-ad-modal .modal-header {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 10;
                    border: none;
                    background: transparent;
                    padding: 8px 12px;
                }
                .popup-ad-modal .modal-header .btn-close {
                    background-color: rgba(255,255,255,0.9);
                    border-radius: 50%;
                    padding: 6px;
                    font-size: 0.7rem;
                    opacity: 1;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                .popup-ad-modal .modal-body {
                    padding: 0 !important;
                }
                .popup-ad-image-container {
                    display: block;
                    line-height: 0;
                }
                .popup-ad-image-container:hover {
                    opacity: 0.95;
                }
                .popup-countdown-bar {
                    height: 4px;
                    background: #e9ecef;
                    overflow: hidden;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    border-radius: 0 0 12px 12px;
                }
                .popup-countdown-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #007bff, #00c6ff);
                    transition: width 1s linear;
                }
                .popup-countdown-badge {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: rgba(0,0,0,0.65);
                    color: #fff;
                    font-size: 0.7rem;
                    padding: 5px 12px;
                    border-radius: 12px 0 12px 0;
                    z-index: 20;
                }
            `}</style>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                className="popup-ad-modal"
                backdrop="static"
            >
                {countdown !== null && countdown > 0 && (
                    <span className="popup-countdown-badge">
                        Closing in {countdown}s
                    </span>
                )}
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {ad.type === 'google_adsense' ? (
                        <div className="google-ad-container" style={{ padding: '1.5rem' }}>
                            {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                            {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
                        </div>
                    ) : (
                        imgSrc && (
                            <a
                                href={adLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleAdClick}
                                className="popup-ad-image-container"
                            >
                                <Image
                                    src={imgSrc}
                                    alt={adTitle}
                                    width={800}
                                    height={600}
                                    className="img-fluid"
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',
                                        borderRadius: '12px'
                                    }}
                                    priority
                                />
                            </a>
                        )
                    )}
                </Modal.Body>
                {/* Auto-close progress bar at the bottom */}
                {progressPercent !== null && (
                    <div className="popup-countdown-bar">
                        <div
                            className="popup-countdown-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PopupAd;
