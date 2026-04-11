"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { STATIC_URL } from '@/app/lib/api';
import { Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import Image from 'next/image';
import { Helmet } from 'react-helmet-async';

const NewsDetails = ({ id, initialData, initialAds }) => {
    const [news, setNews] = useState(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [fontSize, setFontSize] = useState(19);

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
        if (imagePath.startsWith('http')) {
            return imagePath.replace(/^http:\/\//, 'https://');
        }
        return `${STATIC_BASE}/${imagePath.replace(/^\//, '')}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    };

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 22));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 14));
    const handlePrint = () => window.print();

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
            {/* SEO Helmet - Dynamic meta tags only (title is handled by generateMetadata) */}
            {news && (
                <Helmet>
                    <meta name="description" content={news.metaDescription || news.shortDescription || ''} />
                    {news.metaKeywords && <meta name="keywords" content={news.metaKeywords} />}
                    {leadImageUrl && <meta property="og:image" content={leadImageUrl} />}
                    {leadImageUrl && <meta property="twitter:image" content={leadImageUrl} />}
                    <meta property="og:title" content={news.newsHeadline || 'News'} />
                    <meta property="og:description" content={news.metaDescription || news.shortDescription || ''} />
                </Helmet>
            )}
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
                                    <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                        <Image
                                            src={ad.image.startsWith('http') ? ad.image : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/ads/${ad.image}`}
                                            alt={ad.name || 'Advertisement'}
                                            fill
                                            className="rounded shadow-sm"
                                            style={{ objectFit: 'contain' }}
                                            sizes="(max-width: 768px) 100vw, 728px"
                                        />
                                    </div>
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

                        <h1 className="fw-bold mb-3 font-bangla" style={{ fontSize: '2.5rem', lineHeight: '1.4', color: '#1a1a1a' }}>
                            {news.newsHeadline}
                        </h1>

                        {news.highlight && (
                            <div
                                className="text-secondary custom-font mb-4 fst-italic news-highlight-content"
                                style={{ fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '500' }}
                                dangerouslySetInnerHTML={{ __html: news.highlight }}
                            />
                        )}

                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 py-3 border-top border-bottom">
                            <div className="d-flex align-items-center text-muted small font-bangla">
                                {news.Author && (
                                    <div className="me-4 text-dark fw-bold">
                                        <i className="bi bi-person-circle me-2 text-secondary"></i>
                                        {news.Author.name}
                                    </div>
                                )}
                                <div>
                                    <i className="bi bi-calendar3 me-2 text-secondary"></i>
                                    {formatDate(news.createdAt)}
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0 flex-wrap">
                                <div className="d-flex align-items-center border rounded-pill px-2 py-1 no-print">
                                    <button
                                        className="btn btn-sm p-0 px-2 border-0"
                                        onClick={decreaseFontSize}
                                        disabled={fontSize <= 14}
                                        title="ফন্ট ছোট করুন"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm p-0 px-2 border-0"
                                        onClick={increaseFontSize}
                                        disabled={fontSize >= 22}
                                        title="ফন্ট বড় করুন"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <button
                                    className="btn btn-sm btn-light rounded-circle shadow-sm border no-print"
                                    onClick={handlePrint}
                                    title="প্রিন্ট করুন"
                                >
                                    <i className="fas fa-print"></i>
                                </button>

                                <span className="me-1 text-muted small no-print">শেয়ার:</span>
                                <button className="btn btn-sm btn-light rounded-circle me-1 shadow-sm border no-print"><i className="fab fa-facebook-f text-primary"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle me-1 shadow-sm border no-print"><i className="fab fa-twitter text-info"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle shadow-sm border no-print"><i className="fab fa-whatsapp text-success"></i></button>
                            </div>
                        </div>

                        {(() => {
                            const isVideo = news.newsType === 'video';
                            const youtubeId = getYouTubeId(news.videoLink);

                            if ((isVideo || news.Categories?.some(cat => cat.name === 'ভিডিও' || cat.path === 'video')) && youtubeId) {
                                return (
                                    <div className="mb-4 no-print">
                                        <div className="video-responsive rounded shadow-sm overflow-hidden bg-black" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                            <iframe
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
                                    <div className="hero-image-wrapper rounded shadow-sm overflow-hidden bg-light" style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '300px', maxHeight: '500px' }}>
                                        <Image
                                            src={leadImageUrl}
                                            alt={news.imageCaption || news.newsHeadline}
                                            width={800}
                                            height={500}
                                            className="w-100 h-auto object-fit-cover"
                                            priority
                                            sizes="(max-width: 800px) 100vw, 800px"
                                        />
                                    </div>
                                    {news.imageCaption && (
                                        <p className="text-muted small text-center mt-2 font-bangla px-3 fst-italic">
                                            {news.imageCaption}
                                        </p>
                                    )}
                                </div>
                            );
                        })()}

                        <style>
                            {`
                                .article-body { color: #333; word-wrap: break-word; line-height: 1.9; font-size: ${fontSize}px !important; }
                                .article-body p, .article-body div, .article-body span, .article-body li, .article-body blockquote, .article-body figcaption, .article-body section, .article-body article {
                                    font-family: 'custom_font' !important; font-size: ${fontSize}px !important; line-height: inherit !important;
                                }
                                .article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6 {
                                    font-family: 'custom_font' !important; font-size: ${fontSize + 4}px !important; line-height: 1.4 !important;
                                }
                                .article-body ul, .news-highlight-content ul { list-style-type: disc !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                                .article-body ol, .news-highlight-content ol { list-style-type: decimal !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                                .article-body li, .news-highlight-content li { margin-bottom: 0.5rem !important; display: list-item !important; }
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
                                                <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
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
                                                        <p className="text-muted small text-center mb-0 font-bangla px-3 fst-italic">
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
                                                                src={imgSrc}
                                                                alt={ad.name || 'Advertisement'}
                                                                fill
                                                                className="rounded shadow-sm"
                                                                style={{ objectFit: 'contain' }}
                                                                sizes="(max-width: 992px) 0vw, 350px"
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
                                        <div key={item.id || idx} className="d-flex align-items-start gap-3 mb-4 pb-3 border-bottom hover-bg-light transition rounded p-2">
                                            {rImg && (
                                                <div className="flex-shrink-0" style={{ width: '100px', height: '70px', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                                                    <Link href={`/news/${item.id || item._id}`} className="d-block w-100 h-100">
                                                        <Image
                                                            src={rImg}
                                                            alt={item.newsHeadline}
                                                            fill
                                                            className="object-fit-cover hover-zoom"
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
                                    <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '728px', margin: '0 auto' }}>
                                        <Image
                                            src={ad.image.startsWith('http') ? ad.image : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/ads/${ad.image}`}
                                            alt={ad.name || 'Advertisement'}
                                            fill
                                            className="rounded shadow-sm"
                                            style={{ objectFit: 'contain' }}
                                            sizes="(max-width: 768px) 100vw, 728px"
                                        />
                                    </div>
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
