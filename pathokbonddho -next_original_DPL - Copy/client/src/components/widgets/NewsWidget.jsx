import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NewsWidget = ({ cell }) => {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                if (!cell.contentId && !cell.tag) {
                    setLoading(false);
                    return;
                }

                if (cell.contentId) {
                    const response = await axios.get(`${API_BASE_URL}/api/news/${cell.contentId}`);
                    setNews(response.data.data || response.data.news || response.data);
                } else if (cell.tag) {
                    const response = await axios.get(`${API_BASE_URL}/api/news?tag=${cell.tag}&limit=1`);
                    const newsItems = response.data.news || response.data.rows || [];
                    if (newsItems.length > 0) {
                        setNews(newsItems[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching news widget data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [cell.contentId, cell.tag, API_BASE_URL]);

    const getImageUrl = (newsItem) => {
        if (!newsItem) return null;
        const imagePath = newsItem.thumbImage || newsItem.leadImage || newsItem.metaImage;
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) {
            return imagePath.replace(/^http:\/\//, 'https://');
        }
        return `${API_BASE_URL}/${imagePath.replace(/^\//, '')}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // Calculate dynamic image height based on cell merge span
    const getImageHeight = () => {
        const rowSpan = cell.rowSpan || 1;
        const colSpan = cell.colSpan || 1;
        const baseHeight = 200;
        return rowSpan > 1 || colSpan > 1
            ? baseHeight * rowSpan + (rowSpan - 1) * 20
            : baseHeight;
    };

    // Render category badge content: icon for ছবি/ভিডিও, text for others
    const renderCategoryBadgeContent = (category) => {
        if (!category) return null;
        const name = category.name?.trim();
        if (name === 'ছবি') return <i className="fas fa-camera" title="ছবি"></i>;
        if (name === 'ভিডিও') return <i className="fas fa-video" title="ভিডিও"></i>;
        return name;
    };

    if (loading) {
        return <div className="text-center p-2"><Spinner animation="border" size="sm" /></div>;
    }

    if (!news) {
        return null;
    }

    const imageUrl = getImageUrl(news);
    const newsLink = `/news/${news._id || news.id}`;
    const design = cell.design || 'title-image-top'; // default design
    const imageHeight = getImageHeight();

    // ─── DESIGN: text-inside-image ───
    if (design === 'text-inside-image') {
        return (
            <div className="news-design-text-inside-image h-100 pb-2">
                <Link to={newsLink} className="text-decoration-none">
                    <div className="text-inside-image-wrapper">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={news.newsHeadline}
                                className="text-inside-image-img"
                                onError={(e) => {
                                    const altPath = news.leadImage || news.thumbImage;
                                    if (altPath && e.target.src.indexOf(altPath) === -1) {
                                        e.target.src = `${API_BASE_URL}/${altPath.replace(/^\//, '')}`;
                                    } else {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }
                                }}
                            />
                        ) : (
                            <div className="h-100 w-100 bg-secondary d-flex align-items-center justify-content-center">
                                <span className="text-white" style={{ fontSize: '2rem' }}>📰</span>
                            </div>
                        )}
                        <div className="text-inside-image-overlay">
                            <h5 className="text-inside-image-title code-font-bangla">
                                {news.alternativeHeadline || news.newsHeadline}
                            </h5>
                            <span className="text-inside-image-date">
                                {formatDate(news.createdAt)}
                            </span>
                        </div>
                    </div>
                </Link>
                {news.Categories && news.Categories[0] && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
                        {renderCategoryBadgeContent(news.Categories[0])}
                    </Badge>
                )}
            </div>
        );
    }

    // ─── DESIGN: title-only ───
    if (design === 'title-only') {
        return (
            <div className="news-design-title-only h-100">
                <Link to={newsLink} className="text-decoration-none text-dark">
                    <h5 className="fw-bold mb-2 code-font-bangla news-title-only-headline">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
            </div>
        );
    }

    // ─── DESIGN: title-image-left ───
    if (design === 'title-image-left') {
        return (
            <div className="news-design-title-image-side h-100">
                <Link to={newsLink} className="text-decoration-none text-dark">
                    <h5 className="fw-bold mb-2 code-font-bangla">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                <div className="d-flex gap-3">
                    {imageUrl && (
                        <div className="news-side-image-wrapper flex-shrink-0">
                            {news.Categories && news.Categories[0] && (
                                <Badge bg="danger" className="position-absolute start-0 m-2">{renderCategoryBadgeContent(news.Categories[0])}</Badge>
                            )}
                            <Link to={newsLink}>
                                <img
                                    src={imageUrl}
                                    alt={news.newsHeadline}
                                    className="news-side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                />
                            </Link>
                        </div>
                    )}
                    <div className="flex-grow-1">
                        {news.shortDescription && (
                            <p className="small custom-font text-muted mb-2 code-font-bangla">{news.shortDescription}</p>
                        )}
                        <div className="small text-muted">{formatDate(news.createdAt)}</div>
                    </div>
                </div>

            </div>
        );
    }

    // ─── DESIGN: title-image-right ───
    if (design === 'title-image-right') {
        return (
            <div className="news-design-title-image-side h-100">
                <Link to={newsLink} className="text-decoration-none text-dark">
                    <h5 className="fw-bold mb-2 code-font-bangla">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                <div className="d-flex flex-row-reverse gap-3">

                    {imageUrl && (
                        <div className="news-side-image-wrapper flex-shrink-0">
                            {news.Categories && news.Categories[0] && (
                                <Badge bg="danger" className="position-absolute end-0 m-2">{renderCategoryBadgeContent(news.Categories[0])}</Badge>
                            )}
                            <Link to={newsLink}>
                                <img
                                    src={imageUrl}
                                    alt={news.newsHeadline}
                                    className="news-side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                />
                            </Link>
                        </div>
                    )}
                    <div className="flex-grow-1">
                        {news.shortDescription && (
                            <p className="small custom-font text-muted mb-2 code-font-bangla">{news.shortDescription}</p>
                        )}
                        <div className="small text-muted">{formatDate(news.createdAt)}</div>
                    </div>
                </div>

            </div>
        );
    }

    // ─── DESIGN: image-top ───
    if (design === 'image-top') {
        return (
            <Card className="h-100 border-0 news-widget news-design-image-top">
                <div className="card-img-wrapper position-relative" style={{ height: `${imageHeight}px`, overflow: 'hidden' }}>
                    <Link to={newsLink}>
                        {imageUrl ? (
                            <Card.Img
                                variant="top"
                                src={imageUrl}
                                className="h-100 w-100 object-fit-cover"
                                onError={(e) => {
                                    const altPath = news.leadImage || news.thumbImage;
                                    if (altPath && e.target.src.indexOf(altPath) === -1) {
                                        e.target.src = `${API_BASE_URL}/${altPath.replace(/^\//, '')}`;
                                    } else {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }
                                }}
                            />
                        ) : (
                            <div className="h-100 w-100 bg-light d-flex align-items-center justify-content-center">
                                <span className="text-muted">📰</span>
                            </div>
                        )}
                    </Link>
                    {news.Categories && news.Categories[0] && (
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                            {renderCategoryBadgeContent(news.Categories[0])}
                        </Badge>
                    )}
                </div>
                <Card.Body className='px-0 py-2'>
                    <Link to={newsLink} className="text-decoration-none text-dark">
                        <h5 className="fw-bold mb-1 code-font-bangla">
                            {news.alternativeHeadline || news.newsHeadline}
                        </h5>
                    </Link>
                    <div className="small text-muted">
                        {formatDate(news.createdAt)}
                    </div>
                </Card.Body>
            </Card>
        );
    }

    // ─── DESIGN: image-left ───
    if (design === 'image-left') {
        return (
            <div className="news-design-image-compact d-flex gap-3 h-100 align-items-start">
                {imageUrl && (
                    <div className="news-compact-image-wrapper flex-shrink-0">
                        {news.Categories && news.Categories[0] && (
                            <Badge bg="danger" className="position-absolute start-0 m-2">
                                {renderCategoryBadgeContent(news.Categories[0])}
                            </Badge>
                        )}
                        <Link to={newsLink}>
                            <img
                                src={imageUrl}
                                alt={news.newsHeadline}
                                className="news-compact-image"
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                        </Link>
                    </div>
                )}
                <div className="flex-grow-1">
                    <Link to={newsLink} className=" text-decoration-none text-dark">
                        <h5 className="fw-bold mb-1 code-font-bangla">{news.alternativeHeadline || news.newsHeadline}</h5>
                    </Link>
                    <div className="small text-muted">{formatDate(news.createdAt)}</div>
                </div>
            </div>
        );
    }

    // ─── DESIGN: image-right ───
    if (design === 'image-right') {
        return (
            <div className="news-design-image-compact d-flex flex-row-reverse gap-3 h-100 align-items-start">
                {imageUrl && (
                    <div className="news-compact-image-wrapper flex-shrink-0">
                        {news.Categories && news.Categories[0] && (
                            <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                                {renderCategoryBadgeContent(news.Categories[0])}
                            </Badge>
                        )}
                        <Link to={newsLink}>
                            <img
                                src={imageUrl}
                                alt={news.newsHeadline}
                                className="news-compact-image"
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                        </Link>
                    </div>
                )}
                <div className="flex-grow-1">
                    <Link to={newsLink} className="text-decoration-none text-dark">
                        <h5 className="fw-bold mb-1 code-font-bangla">{news.alternativeHeadline || news.newsHeadline}</h5>
                    </Link>
                    <div className="small text-muted">{formatDate(news.createdAt)}</div>
                </div>
            </div>
        );
    }

    // ─── DESIGN: title-image-top (DEFAULT) ───
    return (
        <Card className="h-100 border-0 news-widget">
            <div className="card-img-wrapper position-relative" style={{ height: `${imageHeight}px`, overflow: 'hidden' }}>
                <Link to={newsLink}>
                    {imageUrl ? (
                        <Card.Img
                            variant="top"
                            src={imageUrl}
                            className="h-100 w-100 object-fit-cover"
                            onError={(e) => {
                                const altPath = news.leadImage || news.thumbImage;
                                if (altPath && e.target.src.indexOf(altPath) === -1) {
                                    e.target.src = `${API_BASE_URL}/${altPath.replace(/^\//, '')}`;
                                } else {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }
                            }}
                        />
                    ) : (
                        <div className="h-100 w-100 bg-light d-flex align-items-center justify-content-center">
                            <span className="text-muted">📰</span>
                        </div>
                    )}
                </Link>
                {news.Categories && news.Categories[0] && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                        {renderCategoryBadgeContent(news.Categories[0])}
                    </Badge>
                )}
            </div>
            <Card.Body className='px-0'>
                <Link to={newsLink} className="text-decoration-none text-dark">
                    <Card.Title className="h5 fw-bold mb-2 code-font-bangla">
                        {news.alternativeHeadline || news.newsHeadline}
                    </Card.Title>
                </Link>
                {news.shortDescription && (
                    <Card.Text className="small custom-font text-muted mb-2 code-font-bangla">
                        {news.shortDescription}
                    </Card.Text>
                )}
                <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>{formatDate(news.createdAt)}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default NewsWidget;
