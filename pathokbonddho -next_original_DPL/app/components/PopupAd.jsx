"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import api from '@/app/lib/api';

const PopupAd = () => {
    const pathname = usePathname();
    const [ad, setAd] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
                        // Check if already shown in this session
                        const sessionKey = `popup_ad_shown_${activeAd.id || activeAd._id}`;
                        const alreadyShown = sessionStorage.getItem(sessionKey);
                        
                        if (!alreadyShown) {
                            setAd(activeAd);
                            // Small delay before showing the popup
                            setTimeout(() => {
                                setShow(true);
                                // Record impression
                                api.post(`/ads/${activeAd.id || activeAd._id}/impression`).catch(() => {});
                            }, 1500);
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
    }, [pathname, currentPage, pageSlug]);

    const handleClose = () => {
        setShow(false);
        if (ad) {
            sessionStorage.setItem(`popup_ad_shown_${ad.id || ad._id}`, 'true');
        }
    };

    const handleAdClick = () => {
        if (ad) {
            api.post(`/ads/${ad.id || ad._id}/click`).catch(() => {});
            handleClose();
        }
    };

    if (!ad || !show) return null;

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
        <>
            <style jsx global>{`
                .popup-ad-modal .modal-content {
                    border: none;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.3);
                }
                .popup-ad-modal .modal-header {
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                    padding: 0.5rem 1rem;
                }
                .popup-ad-modal .btn-close {
                    font-size: 0.8rem;
                }
                .popup-ad-image-container {
                    transition: transform 0.3s ease;
                }
                .popup-ad-image-container:hover {
                    transform: scale(1.01);
                }
            `}</style>
            <Modal 
                show={show} 
                onHide={handleClose} 
                centered 
                size="lg"
                className="popup-ad-modal"
                backdrop="static"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="small text-muted font-bangla">বিজ্ঞাপন</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-3">
                    {ad.type === 'google_adsense' ? (
                        <div className="google-ad-container py-4">
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
                                className="d-block popup-ad-image-container"
                            >
                                <div className="position-relative w-100" style={{ minHeight: '300px', maxHeight: '75vh', overflow: 'hidden' }}>
                                    <Image
                                        src={imgSrc}
                                        alt={adTitle}
                                        width={800}
                                        height={600}
                                        className="img-fluid rounded"
                                        style={{ 
                                            objectFit: 'contain', 
                                            width: '100%', 
                                            height: 'auto',
                                            maxHeight: '75vh'
                                        }}
                                        priority
                                    />
                                </div>
                            </a>
                        )
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PopupAd;
