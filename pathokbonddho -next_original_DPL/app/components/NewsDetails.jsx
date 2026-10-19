"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { STATIC_URL, sanitizeImageUrl } from '@/app/lib/api';
import { Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import Image from 'next/image';
import { formatBengaliDate } from '@/app/lib/dateUtils';
const NewsDetails = ({ id, initialData, initialAds }) => {
    const [news, setNews] = useState(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [fontSize, setFontSize] = useState(19);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setFontSize(17);
        }
    }, []);

    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [sidebarAds, setSidebarAds] = useState(initialAds?.sidebar || []);
    const [headerAds, setHeaderAds] = useState(initialAds?.header || []);
    const [footerAds, setFooterAds] = useState(initialAds?.footer || []);

    const STATIC_BASE = STATIC_URL || 'http://localhost:5000';

    useEffect(() => {
        // If we have initial data, we can skip the main fetch
        if (initialData) {
            setNews(initialData);
            setLoading(false);
            // Still need to fetch related news and handle ad impressions
            fetchSecondaryContent(initialData);
            return;
        }

        const fetchNewsDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/news/${id}`);
                const articleData = response.data.data || response.data.news || response.data;

                if (!articleData) throw new Error("Article not found");
                setNews(articleData);
                fetchSecondaryContent(articleData);
            } catch (err) {
                console.error('Error fetching news details:', err);
                setError(err.message || "Failed to load the article.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetails();
        window.scrollTo(0, 0);
    }, [id, initialData, STATIC_BASE]);

    const fetchSecondaryContent = async (articleData) => {
        // Fetch related news
        let relatedParams = { limit: 6, status: 'published', excludeIds: id };
        if (articleData.Categories && articleData.Categories.length > 0) {
            relatedParams.categories = articleData.Categories[0].slug || articleData.Categories[0].name;
        }

        try {
            const relatedRes = await api.get('/news', { params: relatedParams });
            setRelatedNews(relatedRes.data.news || relatedRes.data.rows || []);
        } catch (e) {
            console.error('Error fetching related news:', e);
        }

        // Handle Ad Impressions (for pre-fetched ads)
        if (initialAds) {
            [...(initialAds.header || []), ...(initialAds.sidebar || []), ...(initialAds.footer || [])].forEach(ad => {
                const adId = ad.id || ad._id;
                if (adId) {
                    api.post(`/ads/${adId}/impression`).catch(() => { });
                }
            });
        } else {
            // Fetch ads if not provided
            try {
                const [headerRes, sidebarRes, footerRes] = await Promise.all([
                    api.get('/ads/position', { params: { position: 'header', page: 'details' } }),
                    api.get('/ads/position', { params: { position: 'sidebar', page: 'details' } }),
                    api.get('/ads/position', { params: { position: 'footer', page: 'details' } })
                ]);
                setSidebarAds(sidebarRes.data || []);
                setHeaderAds(headerRes.data || []);
                setFooterAds(footerRes.data || []);
            } catch (err) {
                console.error('Error fetching ads on client:', err);
            }
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return sanitizeImageUrl(imagePath);
    };

    const formatDate = (dateStr) => {
        return formatBengaliDate(dateStr, true);
    };

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 22));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 14));
    const handlePrint = () => window.print();

    const handleSocialShare = (platform) => {
        if (typeof window === 'undefined') return;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(news.newsHeadline);
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
                break;
            default:
                return;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const handleWebShare = async () => {
        if (typeof window === 'undefined') return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: news.newsHeadline,
                    text: news.highlight ? news.highlight.replace(/<[^>]*>/g, '') : '',
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('লিঙ্কটি কপি করা হয়েছে!');
            } catch (err) {
                console.error('Clipboard error:', err);
            }
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading && !news) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="grow" variant="success" />
            </Container>
        );
    }

    if (error || !news) {
        return (
            <Container className="py-5" style={{ minHeight: '60vh' }}>
                <Alert variant="danger" className="text-center shadow-sm">
                    <Alert.Heading className="custom-font mt-2">খবরটি পাওয়া যায়নি</Alert.Heading>
                    <p>{error || "The requested article could not be loaded."}</p>
                    <Link href="/" className="btn btn-outline-danger mt-3 font-bangla">নীড়ে ফিরে যান</Link>
                </Alert>
            </Container>
        );
    }

    let imagePathForLead = news.leadImage || news.metaImage || news.thumbImage;
    if (!imagePathForLead && news.newsType === 'video' && news.videoLink) {
        const videoId = getYouTubeId(news.videoLink);
        if (videoId) imagePathForLead = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    const leadImageUrl = getImageUrl(imagePathForLead);

    return (
        <article className="news-details-page bg-white pb-5">

            <Container className="pt-3">
                {headerAds.map((ad, idx) => (
                    <div key={ad.id || idx} className="mb-4 text-center">
                        {ad.type === 'google_adsense' ? (
                            <div className="w-100 overflow-hidden">
                                {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                                {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
                            </div>
                        ) : (
                            ad.image && (
                                <a
                                    href={ad.imageUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        const adId = ad.id || ad._id;
                                        if (adId) {
                                            api.post(`/ads/${adId}/click`).catch(() => { });
                                        }
                                    }}
                                >
                                    {ad.mobileImage ? (
                                        <>
                                            {/* Desktop view */}
                                            <div className="d-none d-md-block" style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                                <Image
                                                    src={sanitizeImageUrl(ad.image.startsWith('http') ? ad.image : `uploads/ads/${ad.image}`)}
                                                    alt={ad.name || 'Advertisement'}
                                                    fill
                                                    className="rounded shadow-sm"
                                                    style={{ objectFit: 'contain' }}
                                                    sizes="(max-width: 992px) 100vw, 728px"
                                                    priority={idx === 0}
                                                />
                                            </div>
                                            {/* Mobile view */}
                                            <div className="d-block d-md-none" style={{ position: 'relative', height: '100px', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                                                <Image
                                                    src={sanitizeImageUrl(ad.mobileImage.startsWith('http') ? ad.mobileImage : `uploads/ads/${ad.mobileImage}`)}
                                                    alt={ad.name || 'Advertisement'}
                                                    fill
                                                    className="rounded shadow-sm"
                                                    style={{ objectFit: 'contain' }}
                                                    sizes="(max-width: 992px) 100vw, 480px"
                                                    priority={idx === 0}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                            <Image
                                                src={sanitizeImageUrl(ad.image.startsWith('http') ? ad.image : `uploads/ads/${ad.image}`)}
                                                alt={ad.name || 'Advertisement'}
                                                fill
                                                className="rounded shadow-sm"
                                                style={{ objectFit: 'contain' }}
                                                sizes="(max-width: 992px) 100vw, 728px"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    )}
                                </a>
                            )
                        )}
                    </div>
                ))}
            </Container>

            <Container className="pt-2 custom-font">
                <Row className="g-5">
                    <Col lg={8} className="main-article-column">
                        <div className="mb-3">
                            {news.Categories && news.Categories.map(cat => (
                                <Link
                                    href={`/${cat.path}`}
                                    key={cat.id || cat._id}
                                    className="text-decoration-none"
                                >
                                    <Badge bg="danger" className="me-2 px-3 py-2 font-bangla rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
                                        {cat.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>

                        <h1 className="fw-bold mb-3 font-bangla news-main-headline">
                            {news.newsHeadline}
                        </h1>

                        {news.highlight && (
                            <div
                                className="text-secondary custom-font mb-4 fst-italic news-highlight-content"
                                dangerouslySetInnerHTML={{ __html: news.highlight }}
                            />
                        )}

                        <div className="meta-info-container mb-4 py-2 border-top border-bottom no-print">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                                {/* Left Side: Author and Date */}
                                <div className="d-flex flex-wrap align-items-center text-muted font-bangla gap-3">
                                    {news.Author && (
                                        <div className="author-info d-flex align-items-center text-dark fw-bold">
                                            <i className="bi bi-person-circle me-2 fs-5 text-secondary"></i>
                                            <span>{news.Author.name}</span>
                                        </div>
                                    )}
                                    <div className="date-info d-flex align-items-center small">
                                        <i className="bi bi-calendar3 me-2 text-secondary"></i>
                                        {formatDate(news.createdAt)}
                                    </div>
                                </div>

                                {/* Right Side: Tools and Sharing */}
                                <div className="d-flex align-items-center gap-2 action-tools">
                                    <div className="font-size-controls d-flex align-items-center no-print">
                                        <button
                                            className="btn btn-sm border-0"
                                            onClick={decreaseFontSize}
                                            disabled={fontSize <= 14}
                                            title="ফন্ট ছোট করুন"
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <div className="border-start mx-1" style={{ height: '15px' }}></div>
                                        <button
                                            className="btn btn-sm border-0"
                                            onClick={increaseFontSize}
                                            disabled={fontSize >= 22}
                                            title="ফন্ট বড় করুন"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>

                                    <button
                                        className="btn-tool no-print"
                                        onClick={handlePrint}
                                        title="প্রিন্ট করুন"
                                    >
                                        <i className="fas fa-print"></i>
                                    </button>

                                    <button
                                        className="btn-tool no-print"
                                        onClick={handleWebShare}
                                        title="শেয়ার করুন"
                                    >
                                        <i className="fas fa-share-alt"></i>
                                    </button>

                                    <div className="social-share-group d-flex align-items-center gap-2">
                                        <span className="me-1 text-muted small no-print">শেয়ার:</span>
                                        <button
                                            className="share-btn btn-light no-print"
                                            onClick={() => handleSocialShare('facebook')}
                                            title="ফেসবুকে শেয়ার করুন"
                                        >
                                            <i className="fab fa-facebook-f text-primary"></i>
                                        </button>
                                        <button
                                            className="share-btn btn-light no-print"
                                            onClick={() => handleSocialShare('twitter')}
                                            title="টুইটারে শেয়ার করুন"
                                        >
                                            <i className="fab fa-x-twitter text-info"></i>
                                        </button>
                                        <button
                                            className="share-btn btn-light no-print"
                                            onClick={() => handleSocialShare('whatsapp')}
                                            title="হোয়াটসঅ্যাপে শেয়ার করুন"
                                        >
                                            <i className="fab fa-whatsapp text-success"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(() => {
                            const isVideo = news.newsType === 'video';
                            const youtubeId = getYouTubeId(news.videoLink);

                            if ((isVideo || news.Categories?.some(cat => cat.name === 'ভিডিও' || cat.path === 'video')) && youtubeId) {
                                return (
                                    <div className="mb-4 no-print">
                                        <div className="video-responsive shadow-sm overflow-hidden bg-black" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 0 }}>
                                            <iframe
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }}
                                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
                                                title={news.newsHeadline}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                );
                            }

                            if (news.newsType === 'photo') return null;

                            return leadImageUrl && (
                                <div className="mb-4">
                                    <div className="hero-image-wrapper shadow-sm overflow-hidden bg-light" style={{ position: 'relative', width: '100%', borderRadius: 0 }}>
                                        <Image
                                            src={leadImageUrl}
                                            alt={news.imageCaption || news.newsHeadline}
                                            width={800}
                                            height={500}
                                            className="w-100 h-auto object-fit-cover"
                                            style={{ borderRadius: 0 }}
                                            priority={news.newsType !== 'video'} // Only prioritize if not a video post
                                            sizes="(max-width: 800px) 100vw, 800px"
                                        />
                                    </div>
                                    {news.imageCaption && (
                                        <p className="text-muted text-center mt-2 font-bangla px-3 fst-italic image-caption">
                                            {news.imageCaption}
                                        </p>
                                    )}
                                </div>
                            );
                        })()}

                        <style>
                            {`
                                .news-main-headline { font-size: 2.5rem; line-height: 1.4; color: #1a1a1a; }
                                .news-highlight-content { font-size: 1.2rem; line-height: 1.6; font-weight: 500; }
                                .image-caption { font-size: 1rem !important; }

                                .hero-image-wrapper,
                                .hero-image-wrapper img,
                                .video-responsive,
                                .video-responsive iframe,
                                .related-news-list .flex-shrink-0,
                                .related-news-list img {
                                    border-radius: 0 !important;
                                }

                                .article-body { color: #333; word-wrap: break-word; line-height: 1.9; font-size: ${fontSize}px !important; }
                                .article-body p, .article-body div, .article-body span, .article-body li, .article-body blockquote, .article-body section, .article-body article {
                                    font-family: 'custom_font' !important; font-size: ${fontSize}px !important; line-height: inherit !important;
                                }
                                .article-body figcaption {
                                    font-size: 1rem !important;
                                    font-family: 'custom_font' !important;
                                    line-height: 1.6 !important;
                                }
                                .article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6 {
                                    font-family: 'custom_font' !important; font-size: ${fontSize + 4}px !important; line-height: 1.4 !important;
                                }
                                .article-body ul, .news-highlight-content ul { list-style-type: disc !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                                .article-body ol, .news-highlight-content ol { list-style-type: decimal !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                                .article-body li, .news-highlight-content li { margin-bottom: 0.5rem !important; display: list-item !important; }
                                
                                @media (max-width: 768px) {
                                    .news-main-headline { font-size: 1.8rem !important; }
                                    .news-highlight-content { font-size: 1.1rem !important; }
                                    .action-tools { width: 100%; justify-content: flex-start; border-top: 1px solid #eee; padding-top: 10px; flex-wrap: nowrap !important; }
                                    .social-share-group { margin-left: 10px; }
                                }

                                .meta-info-container { border-color: #eee !important; }
                                .author-info i { color: #dc3545; }
                                .font-size-controls { background: #fff; border: 1px solid #ddd; border-radius: 20px; padding: 2px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                                .font-size-controls button:hover { background: #f8f9fa; color: #dc3545; }
                                .btn-tool { width: 35px; height: 35px; border-radius: 50%; border: 1px solid #ddd; background: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                                .btn-tool:hover { background: #f8f9fa; color: #dc3545; transform: translateY(-2px); }
                                .share-btn { width: 32px; height: 32px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; color: #fff; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                                .share-btn:hover { transform: scale(1.1); filter: brightness(1.1); }
                                .share-btn.fb { background: #3b5998; }
                                .share-btn.tw { background: #1da1f2; }
                                .share-btn.wa { background: #25d366; }

                                /* Dark Mode Support */
                                html.dark .news-details-page,
                                [data-bs-theme="dark"] .news-details-page,
                                [data-theme="dark"] .news-details-page {
                                    background-color: transparent !important;
                                }

                                html.dark .news-main-headline,
                                [data-bs-theme="dark"] .news-main-headline,
                                [data-theme="dark"] .news-main-headline {
                                    color: #f8fafc !important;
                                }

                                html.dark .news-highlight-content,
                                [data-bs-theme="dark"] .news-highlight-content,
                                [data-theme="dark"] .news-highlight-content {
                                    color: #cbd5e1 !important;
                                }

                                html.dark .meta-info-container,
                                [data-bs-theme="dark"] .meta-info-container,
                                [data-theme="dark"] .meta-info-container {
                                    border-color: #334155 !important;
                                }

                                html.dark .author-info,
                                [data-bs-theme="dark"] .author-info,
                                [data-theme="dark"] .author-info {
                                    color: #e2e8f0 !important;
                                }

                                html.dark .font-size-controls,
                                [data-bs-theme="dark"] .font-size-controls,
                                [data-theme="dark"] .font-size-controls {
                                    background: #1e293b !important;
                                    border-color: #334155 !important;
                                    box-shadow: none !important;
                                }

                                html.dark .font-size-controls button,
                                [data-bs-theme="dark"] .font-size-controls button,
                                [data-theme="dark"] .font-size-controls button {
                                    background: transparent !important;
                                    background-color: transparent !important;
                                    border: none !important;
                                    color: #d7dee8 !important;
                                    box-shadow: none !important;
                                }

                                html.dark .font-size-controls button:hover:not(:disabled),
                                [data-bs-theme="dark"] .font-size-controls button:hover:not(:disabled),
                                [data-theme="dark"] .font-size-controls button:hover:not(:disabled) {
                                    background: rgba(255, 255, 255, 0.1) !important;
                                    background-color: rgba(255, 255, 255, 0.1) !important;
                                    color: #fbbf24 !important;
                                }

                                html.dark .font-size-controls button:disabled,
                                [data-bs-theme="dark"] .font-size-controls button:disabled,
                                [data-theme="dark"] .font-size-controls button:disabled {
                                    opacity: 0.35 !important;
                                    color: #64748b !important;
                                    cursor: not-allowed !important;
                                }

                                html.dark .font-size-controls .border-start,
                                [data-bs-theme="dark"] .font-size-controls .border-start,
                                [data-theme="dark"] .font-size-controls .border-start {
                                    border-color: #334155 !important;
                                }

                                html.dark .btn-tool,
                                [data-bs-theme="dark"] .btn-tool,
                                [data-theme="dark"] .btn-tool {
                                    background-color: #1e293b !important;
                                    color: #d7dee8 !important;
                                    border-color: #334155 !important;
                                    box-shadow: none !important;
                                }

                                html.dark .btn-tool:hover,
                                [data-bs-theme="dark"] .btn-tool:hover,
                                [data-theme="dark"] .btn-tool:hover {
                                    background-color: #2d3b55 !important;
                                    color: #fbbf24 !important;
                                }

                                html.dark .share-btn.btn-light,
                                [data-bs-theme="dark"] .share-btn.btn-light,
                                [data-theme="dark"] .share-btn.btn-light {
                                    background-color: #1e293b !important;
                                    border: 1px solid #334155 !important;
                                }

                                html.dark .article-body,
                                [data-bs-theme="dark"] .article-body,
                                [data-theme="dark"] .article-body {
                                    color: #e2e8f0 !important;
                                }

                                html.dark .article-body p,
                                html.dark .article-body div,
                                html.dark .article-body span,
                                html.dark .article-body li,
                                html.dark .article-body blockquote,
                                html.dark .article-body section,
                                html.dark .article-body article,
                                html.dark .article-body strong,
                                html.dark .article-body em,
                                html.dark .article-body b,
                                html.dark .article-body i,
                                html.dark .article-body font,
                                [data-bs-theme="dark"] .article-body p,
                                [data-bs-theme="dark"] .article-body div,
                                [data-bs-theme="dark"] .article-body span,
                                [data-bs-theme="dark"] .article-body li,
                                [data-bs-theme="dark"] .article-body blockquote,
                                [data-bs-theme="dark"] .article-body section,
                                [data-bs-theme="dark"] .article-body article,
                                [data-bs-theme="dark"] .article-body strong,
                                [data-bs-theme="dark"] .article-body em,
                                [data-bs-theme="dark"] .article-body b,
                                [data-bs-theme="dark"] .article-body i,
                                [data-bs-theme="dark"] .article-body font,
                                [data-theme="dark"] .article-body p,
                                [data-theme="dark"] .article-body div,
                                [data-theme="dark"] .article-body span,
                                [data-theme="dark"] .article-body li,
                                [data-theme="dark"] .article-body blockquote,
                                [data-theme="dark"] .article-body section,
                                [data-theme="dark"] .article-body article,
                                [data-theme="dark"] .article-body strong,
                                [data-theme="dark"] .article-body em,
                                [data-theme="dark"] .article-body b,
                                [data-theme="dark"] .article-body i,
                                [data-theme="dark"] .article-body font {
                                    color: #e2e8f0 !important;
                                    background-color: transparent !important;
                                }

                                html.dark .article-body h1,
                                html.dark .article-body h2,
                                html.dark .article-body h3,
                                html.dark .article-body h4,
                                html.dark .article-body h5,
                                html.dark .article-body h6,
                                [data-bs-theme="dark"] .article-body h1,
                                [data-bs-theme="dark"] .article-body h2,
                                [data-bs-theme="dark"] .article-body h3,
                                [data-bs-theme="dark"] .article-body h4,
                                [data-bs-theme="dark"] .article-body h5,
                                [data-bs-theme="dark"] .article-body h6,
                                [data-theme="dark"] .article-body h1,
                                [data-theme="dark"] .article-body h2,
                                [data-theme="dark"] .article-body h3,
                                [data-theme="dark"] .article-body h4,
                                [data-theme="dark"] .article-body h5,
                                [data-theme="dark"] .article-body h6 {
                                    color: #f8fafc !important;
                                }

                                html.dark .article-body a,
                                [data-bs-theme="dark"] .article-body a,
                                [data-theme="dark"] .article-body a {
                                    color: #38bdf8 !important;
                                }

                                html.dark .article-body a:hover,
                                [data-bs-theme="dark"] .article-body a:hover,
                                [data-theme="dark"] .article-body a:hover {
                                    color: #7dd3fc !important;
                                }

                                html.dark .article-body table,
                                html.dark .article-body td,
                                html.dark .article-body th,
                                [data-bs-theme="dark"] .article-body table,
                                [data-bs-theme="dark"] .article-body td,
                                [data-bs-theme="dark"] .article-body th,
                                [data-theme="dark"] .article-body table,
                                [data-theme="dark"] .article-body td,
                                [data-theme="dark"] .article-body th {
                                    border-color: #334155 !important;
                                    color: #e2e8f0 !important;
                                }

                                @media print {
                                    body * { visibility: hidden; }
                                    .news-details-page, .news-details-page .main-article-column, .news-details-page .main-article-column * { visibility: visible; }
                                    .news-details-page .main-article-column { position: absolute; left: 0; top: 0; width: 100%; }
                                    .no-print, .sidebar-column, .social-sharing-icons, header, footer { display: none !important; }
                                }
                            `}
                        </style>
                        <div
                            className="article-body editor-content"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {news.newsType === 'photo' && news.GalleryItems && news.GalleryItems.length > 0 && (
                            <div className="photo-gallery-section mt-5 border-top pt-4">
                                {news.GalleryItems.sort((a, b) => a.sortOrder - b.sortOrder).map((item, idx) => (
                                    <div key={item.id || idx} className="gallery-item mb-5">
                                        {item.imageUrl && (
                                            <div className=" shadow-sm border mb-3 overflow-hidden">
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <Image
                                                        src={getImageUrl(item.imageUrl)}
                                                        alt={item.caption || `Gallery image ${idx + 1}`}
                                                        width={800}
                                                        height={500}
                                                        className="w-100 h-auto"
                                                        style={{ objectFit: 'contain' }}

                                                    />
                                                </div>
                                                {item.caption && (
                                                    <div className="py-2 bg-light border-top">
                                                        <p className="text-muted text-center mb-0 font-bangla px-3 fst-italic image-caption">
                                                            {item.caption}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {item.content && (
                                            <div className="font-bangla text-muted px-2" style={{ lineHeight: '1.8', fontSize: `${fontSize}px` }}>
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {news.Tags && news.Tags.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap gap-2 mt-5 pt-4 border-top">
                                <h6 className="fw-bold mb-0 font-bangla text-muted me-2">ট্যাগ:</h6>
                                {news.Tags.map(tag => (
                                    <span key={tag.id || tag._id} className="badge bg-light text-dark border px-3 py-2 custom-font font-bangla">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Col>

                    <Col lg={4} className="sidebar-column">
                        <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
                            {sidebarAds.length > 0 ? (
                                sidebarAds.map((ad, idx) => {
                                    const adImage = ad.image;
                                    const imgSrc = adImage ? (adImage.startsWith('http') ? adImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/ads/${adImage}`) : null;
                                    return (
                                        <div key={ad.id || idx} className="my-4 text-center">
                                            {ad.type === 'google_adsense' ? (
                                                <div className="w-100 overflow-hidden">
                                                    {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                                                    {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
                                                </div>
                                            ) : (
                                                imgSrc && (
                                                    <a
                                                        href={ad.imageUrl || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => {
                                                            const adId = ad.id || ad._id;
                                                            if (adId) {
                                                                api.post(`/ads/${adId}/click`).catch(() => { });
                                                            }
                                                        }}
                                                    >
                                                        <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                                                            <Image
                                                                src={sanitizeImageUrl(ad.image.startsWith('http') ? ad.image : `uploads/ads/${ad.image}`)}
                                                                alt={ad.name || 'Advertisement'}
                                                                fill
                                                                className="rounded"
                                                                style={{ objectFit: 'contain' }}
                                                                sizes="(max-width: 992px) 100vw, 350px"
                                                            />
                                                        </div>
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="my-4 p-4 bg-light text-center border rounded d-flex align-items-center justify-content-center flex-column" style={{ minHeight: '250px' }}>
                                    <span className="text-muted small mb-2">- Advertisement -</span>
                                    <div className="text-muted opacity-50"><i className="bi bi-badge-ad fs-1"></i></div>
                                </div>
                            )}

                            <div className="section-header mb-4">
                                <div className="section-title-with-lines">
                                    <h4 className="title-text font-bangla fs-5">আরও খবর</h4>
                                </div>
                            </div>
                            <div className="related-news-list">
                                {relatedNews.map((item, idx) => {
                                    const rImg = getImageUrl(item.thumbImage || item.leadImage);
                                    return (
                                        <div key={item.id || idx} className="d-flex align-items-start gap-3 mb-4 pb-3 border-bottom hover-bg-light transition p-2">
                                            {rImg && (
                                                <div className="flex-shrink-0" style={{ width: '100px', height: '70px', overflow: 'hidden', borderRadius: 0, position: 'relative' }}>
                                                    <Link href={`/news/${item.id || item._id}`} className="d-block w-100 h-100 position-relative">
                                                        <Image
                                                            src={rImg}
                                                            alt={item.newsHeadline}
                                                            fill
                                                            className="object-fit-cover hover-zoom"
                                                            style={{ borderRadius: 0 }}
                                                            sizes="100px"
                                                        />
                                                    </Link>
                                                </div>
                                            )}
                                            <div>
                                                <Link href={`/news/${item.id || item._id}`} className="text-decoration-none text-dark">
                                                    <h6 className="fw-bold mb-2 font-bangla hover-danger" style={{ lineHeight: '1.4' }}>{item.alternativeHeadline || item.newsHeadline}</h6>
                                                </Link>
                                                <div className="small text-muted font-bangla" style={{ fontSize: '0.8rem' }}>
                                                    <i className="bi bi-clock me-1"></i>{new Date(item.createdAt).toLocaleDateString('bn-BD')}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className="mt-5 pb-4">
                {footerAds.map((ad, idx) => (
                    <div key={ad.id || idx} className="mb-4 text-center">
                        {ad.type === 'google_adsense' ? (
                            <div className="w-100 overflow-hidden">
                                {ad.headCode && <div dangerouslySetInnerHTML={{ __html: ad.headCode }} />}
                                {ad.bodyCode && <div dangerouslySetInnerHTML={{ __html: ad.bodyCode }} />}
                            </div>
                        ) : (
                            ad.image && (
                                <a
                                    href={ad.imageUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        const adId = ad.id || ad._id;
                                        if (adId) {
                                            api.post(`/ads/${adId}/click`).catch(() => { });
                                        }
                                    }}
                                >
                                    {ad.mobileImage ? (
                                        <>
                                            {/* Desktop view */}
                                            <div className="d-none d-md-block" style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                                <Image
                                                    src={sanitizeImageUrl(ad.image.startsWith('http') ? ad.image : `uploads/ads/${ad.image}`)}
                                                    alt={ad.name || 'Advertisement'}
                                                    fill
                                                    className="rounded shadow-sm"
                                                    style={{ objectFit: 'contain' }}
                                                    sizes="(max-width: 992px) 100vw, 728px"
                                                />
                                            </div>
                                            {/* Mobile view */}
                                            <div className="d-block d-md-none" style={{ position: 'relative', height: '100px', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                                                <Image
                                                    src={sanitizeImageUrl(ad.mobileImage.startsWith('http') ? ad.mobileImage : `uploads/ads/${ad.mobileImage}`)}
                                                    alt={ad.name || 'Advertisement'}
                                                    fill
                                                    className="rounded shadow-sm"
                                                    style={{ objectFit: 'contain' }}
                                                    sizes="(max-width: 992px) 100vw, 480px"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                            <Image
                                                src={sanitizeImageUrl(ad.image.startsWith('http') ? ad.image : `uploads/ads/${ad.image}`)}
                                                alt={ad.name || 'Advertisement'}
                                                fill
                                                className="rounded shadow-sm"
                                                style={{ objectFit: 'contain' }}
                                                sizes="(max-width: 992px) 100vw, 728px"
                                            />
                                        </div>
                                    )}
                                </a>
                            )
                        )}
                    </div>
                ))}
            </Container>
        </article>
    );
};

export default NewsDetails;
