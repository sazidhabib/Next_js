import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(19);

    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [sidebarAds, setSidebarAds] = useState([]);
    const [headerAds, setHeaderAds] = useState([]);
    const [footerAds, setFooterAds] = useState([]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchNewsDetails = async () => {
            try {
                setLoading(true);
                // Fetch the main news article
                const response = await axios.get(`${API_BASE_URL}/api/news/${id}`);
                const articleData = response.data.data || response.data.news || response.data;

                if (!articleData) throw new Error("Article not found");
                setNews(articleData);

                // Fetch related news (if categories exist, fetch by first category tag, otherwise just fetch latest)
                let relatedParams = { limit: 6, status: 'published', excludeIds: id };
                if (articleData.Categories && articleData.Categories.length > 0) {
                    relatedParams.categories = articleData.Categories[0].slug || articleData.Categories[0].name;
                }

                const relatedRes = await axios.get(`${API_BASE_URL}/api/news`, { params: relatedParams });
                setRelatedNews(relatedRes.data.news || relatedRes.data.rows || []);

                // Fetch ads for details page
                try {
                    const [headerRes, sidebarRes, footerRes] = await Promise.all([
                        axios.get(`${API_BASE_URL}/api/ads/position`, { params: { position: 'header', page: 'details' } }),
                        axios.get(`${API_BASE_URL}/api/ads/position`, { params: { position: 'sidebar', page: 'details' } }),
                        axios.get(`${API_BASE_URL}/api/ads/position`, { params: { position: 'footer', page: 'details' } })
                    ]);

                    setSidebarAds(sidebarRes.data || []);
                    setHeaderAds(headerRes.data || []);
                    setFooterAds(footerRes.data || []);

                    // Record impressions for all loaded ads
                    [...(headerRes.data || []), ...(sidebarRes.data || []), ...(footerRes.data || [])].forEach(ad => {
                        const adId = ad.id || ad._id;
                        if (adId) {
                            axios.post(`${API_BASE_URL}/api/ads/${adId}/impression`).catch(() => { });
                        }
                    });
                } catch (err) {
                    console.error('Error fetching ads:', err);
                }

            } catch (err) {
                console.error('Error fetching news details:', err);
                setError(err.message || "Failed to load the article.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetails();

        // Scroll to top when loading a new article
        window.scrollTo(0, 0);
    }, [id, API_BASE_URL]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) {
            return imagePath.replace(/^http:\/\//, 'https://');
        }
        return `${API_BASE_URL}/${imagePath.replace(/^\//, '')}`;
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

    if (loading) {
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
                    <Alert.Heading className="font-bangla mt-2">খবরটি পাওয়া যায়নি</Alert.Heading>
                    <p>{error || "The requested article could not be loaded."}</p>
                    <Link to="/" className="btn btn-outline-danger mt-3 font-bangla">নীড়ে ফিরে যান</Link>
                </Alert>
            </Container>
        );
    }

    const leadImageUrl = getImageUrl(news.leadImage || news.metaImage || news.thumbImage);

    return (
        <article className="news-details-page bg-white pb-5">
            {/* SEO Helmet */}
            <Helmet>
                <title>{news.metaTitle || news.newsHeadline} | পাঠকবন্ধু</title>
                <meta name="description" content={news.metaDescription || news.shortDescription} />
                {news.metaKeywords && <meta name="keywords" content={news.metaKeywords} />}
                {leadImageUrl && <meta property="og:image" content={leadImageUrl} />}
            </Helmet>

            {/* Header Ads */}
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
                                            axios.post(`${API_BASE_URL}/api/ads/${adId}/click`).catch(() => { });
                                        }
                                    }}
                                >
                                    <img
                                        src={ad.image.startsWith('http') ? ad.image : `${API_BASE_URL}/uploads/ads/${ad.image}`}
                                        alt={ad.name || 'Advertisement'}
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '120px', width: 'auto' }}
                                    />
                                </a>
                            )
                        )}
                    </div>
                ))}
            </Container>

            {/* Main Content Container */}
            <Container className="pt-2">
                <Row className="g-5">

                    {/* LEFT COLUMN: Main Article (col-lg-8) */}
                    <Col lg={8} className="main-article-column">

                        {/* Categories Badge (Clickable Breadcrumb) */}
                        <div className="mb-3">
                            {news.Categories && news.Categories.map(cat => (
                                <Link
                                    to={`/${cat.path}`}
                                    key={cat.id || cat._id}
                                    className="text-decoration-none"
                                >
                                    <Badge bg="danger" className="me-2 px-3 py-2 font-bangla rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
                                        {cat.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>

                        {/* Title & Highlight */}
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

                        {/* Meta Bar: Author, Date, Sharing */}
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

                            {/* Tools: Font Size, Print, Sharing */}
                            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0 flex-wrap">
                                {/* Font Size Controls */}
                                <div className="d-flex align-items-center border rounded-pill px-2 py-1 no-print">
                                    <button
                                        className="btn btn-sm p-0 px-2 border-0"
                                        onClick={decreaseFontSize}
                                        disabled={fontSize <= 14}
                                        title="ফন্ট ছোট করুন"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    {/* <span className="mx-1 fw-bold" style={{ minWidth: '28px', textAlign: 'center', fontSize: '14px', color: '#333' }}>{fontSize}</span> */}
                                    <button
                                        className="btn btn-sm p-0 px-2 border-0"
                                        onClick={increaseFontSize}
                                        disabled={fontSize >= 22}
                                        title="ফন্ট বড় করুন"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                {/* Print Button */}
                                <button
                                    className="btn btn-sm btn-light rounded-circle shadow-sm border no-print"
                                    onClick={handlePrint}
                                    title="প্রিন্ট করুন"
                                >
                                    <i className="fas fa-print"></i>
                                </button>

                                {/* Social Sharing */}
                                <span className="me-1 text-muted small no-print">শেয়ার:</span>
                                <button className="btn btn-sm btn-light rounded-circle me-1 shadow-sm border no-print"><i className="fab fa-facebook-f text-primary"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle me-1 shadow-sm border no-print"><i className="fab fa-twitter text-info"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle shadow-sm border no-print"><i className="fab fa-whatsapp text-success"></i></button>
                            </div>
                        </div>

                        {/* Hero Image or Video Player */}
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

                            return leadImageUrl && (
                                <div className="mb-4">
                                    <div className="hero-image-wrapper rounded shadow-sm overflow-hidden bg-light" style={{ maxHeight: '500px' }}>
                                        <img
                                            src={leadImageUrl}
                                            alt={news.imageCaption || news.newsHeadline}
                                            className="w-100 object-fit-cover"
                                            style={{ maxHeight: '500px', display: 'block' }}
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

                        {/* Article Body Content */}
                        <style>
                            {`
                                .article-body {
                                    color: #333;
                                    word-wrap: break-word;
                                    line-height: 1.9;
                                    
                                }
                                .article-body p,
                                .article-body div,
                                .article-body p span, 
                                .article-body p * {
                                    font-family: 'custom_font' !important;
                                    font-size: ${fontSize}px !important;
                                    line-height: inherit !important;
                                }
                                .article-body p:first-of-type,
                                .article-body p:first-of-type span,
                                .article-body p:first-of-type * {
                                    font-size: ${fontSize}px !important;
                                    font-weight: 500 !important;
                                }

                                /* Print styles */
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .news-details-page,
                                    .news-details-page .main-article-column,
                                    .news-details-page .main-article-column * {
                                        visibility: visible;
                                    }
                                    .news-details-page .main-article-column {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                    }
                                    .no-print,
                                    .sidebar-column,
                                    .social-sharing-icons,
                                    header,
                                    footer {
                                        display: none !important;
                                    }
                                }
                            `}
                        </style>
                        <div
                            className="article-body  editor-content"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {/* Photo Gallery (if Photo News) */}
                        {news.newsType === 'photo' && news.GalleryItems && news.GalleryItems.length > 0 && (
                            <div className="photo-gallery-section mt-5 border-top pt-4">
                                <h4 className="fw-bold font-bangla mb-4">গ্যালারি</h4>
                                {news.GalleryItems.sort((a, b) => a.sortOrder - b.sortOrder).map((item, idx) => (
                                    <div key={item.id || idx} className="gallery-item mb-5 bg-light p-3 rounded shadow-sm">
                                        {item.imageUrl && (
                                            <div className="text-center mb-3">
                                                <img
                                                    src={getImageUrl(item.imageUrl)}
                                                    alt={item.caption || `Gallery image ${idx + 1}`}
                                                    className="img-fluid rounded shadow-sm w-100"
                                                />
                                            </div>
                                        )}
                                        {item.caption && (
                                            <h5 className="font-bangla fw-bold mb-2 text-dark">{item.caption}</h5>
                                        )}
                                        {item.content && (
                                            <div className="font-bangla text-muted" style={{ lineHeight: '1.6', fontSize: `${fontSize - 1}px` }}>
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Article Tags */}
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

                    {/* RIGHT COLUMN: Sidebar (col-lg-4) */}
                    <Col lg={4} className="sidebar-column">
                        <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>

                            {/* Dynamic Sidebar Ads */}
                            {sidebarAds.length > 0 ? (
                                sidebarAds.map((ad, idx) => {
                                    const adImage = ad.image;
                                    const imgSrc = adImage ? (adImage.startsWith('http') ? adImage : `${API_BASE_URL}/uploads/ads/${adImage}`) : null;

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
                                                                axios.post(`${API_BASE_URL}/api/ads/${adId}/click`).catch(err => console.error('Click error:', err));
                                                            }
                                                        }}
                                                    >
                                                        <img src={imgSrc} alt={ad.name || 'Advertisement'} className="w-100 img-fluid rounded shadow-sm" style={{ objectFit: 'contain' }} />
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="my-4 p-4 bg-light text-center border rounded d-flex align-items-center justify-content-center flex-column" style={{ minHeight: '250px' }}>
                                    <span className="text-muted small mb-2">- Advertisement -</span>
                                    <div className="text-muted opacity-50">
                                        <i className="bi bi-badge-ad fs-1"></i>
                                    </div>
                                </div>
                            )}

                            <div className="section-header mb-4">
                                <div className="section-title-with-lines">
                                    <h4 className="title-text font-bangla fs-5">আরও খবর</h4>
                                </div>
                            </div>

                            <div className="related-news-list">
                                {relatedNews.length > 0 ? (
                                    relatedNews.map((item, idx) => {
                                        const rImg = getImageUrl(item.thumbImage || item.leadImage);
                                        return (
                                            <div key={item.id || idx} className="d-flex align-items-start gap-3 mb-4 pb-3 border-bottom hover-bg-light transition rounded p-2">
                                                {rImg && (
                                                    <div className="flex-shrink-0" style={{ width: '100px', height: '70px', overflow: 'hidden', borderRadius: '4px' }}>
                                                        <Link to={`/news/${item.id || item._id}`}>
                                                            <img
                                                                src={rImg}
                                                                alt={item.newsHeadline}
                                                                className="w-100 h-100 object-fit-cover hover-zoom"
                                                            />
                                                        </Link>
                                                    </div>
                                                )}
                                                <div>
                                                    <Link to={`/news/${item.id || item._id}`} className="text-decoration-none text-dark">
                                                        <h6 className="fw-bold mb-2 font-bangla hover-danger" style={{ lineHeight: '1.4' }}>
                                                            {item.alternativeHeadline || item.newsHeadline}
                                                        </h6>
                                                    </Link>
                                                    <div className="small text-muted font-bangla" style={{ fontSize: '0.8rem' }}>
                                                        <i className="bi bi-clock me-1"></i>
                                                        {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted small text-center font-bangla py-3 bg-light rounded">No related news found.</p>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer Ads */}
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
                                            axios.post(`${API_BASE_URL}/api/ads/${adId}/click`).catch(() => { });
                                        }
                                    }}
                                >
                                    <img
                                        src={ad.image.startsWith('http') ? ad.image : `${API_BASE_URL}/uploads/ads/${ad.image}`}
                                        alt={ad.name || 'Advertisement'}
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '120px', width: 'auto' }}
                                    />
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
