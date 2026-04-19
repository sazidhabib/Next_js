"use client";
import React, { useState, useEffect } from 'react';
import api, { STATIC_URL } from '@/app/lib/api';
import { Card, Badge, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

const NewsWidget = ({ cell, isPriority }) => {
    const [news, setNews] = useState(cell.resolvedContent || null);
    const [loading, setLoading] = useState(!cell.resolvedContent);
    const STATIC_BASE = STATIC_URL || 'http://localhost:5000';

    const getYoutubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        // Skip fetching if content is already resolved by the server
        if (cell.resolvedContent) {
            setNews(cell.resolvedContent);
            setLoading(false);
            return;
        }

        const fetchNews = async () => {
            try {
                if (!cell.contentId && !cell.tag) {
                    setLoading(false);
                    return;
                }

                if (cell.contentId) {
                    const response = await api.get(`/news/${cell.contentId}`);
                    const data = response.data.data || response.data.news || response.data;
                    setNews(data);
                } else if (cell.tag) {
                    const response = await api.get('/news', { params: { tag: cell.tag, limit: 1 } });
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
    }, [cell.contentId, cell.tag, cell.resolvedContent, STATIC_BASE]);

    const getImageUrl = (newsItem, preferHighRes = false) => {
        if (!newsItem) return null;

        let imagePath;
        if (preferHighRes) {
            imagePath = newsItem.leadImage || newsItem.thumbImage || newsItem.metaImage;
        } else {
            imagePath = newsItem.thumbImage || newsItem.leadImage || newsItem.metaImage;
        }

        if (!imagePath && newsItem.newsType === 'video' && newsItem.videoLink) {
            const videoId = getYoutubeId(newsItem.videoLink);
            if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        if (!imagePath) return null;
        if (imagePath.startsWith('http')) {
            // Only force https if not on a local environment
            const isLocal = imagePath.includes('127.0.0.1') || imagePath.includes('localhost');
            if (isLocal) return imagePath;
            return imagePath.replace(/^http:\/\//, 'https://');
        }
        return `${STATIC_BASE}/${imagePath.replace(/^\//, '')}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getImageHeight = () => {
        const rowSpan = cell.rowSpan || 1;
        const colSpan = cell.colSpan || 1;
        const baseHeight = 160;
        return rowSpan > 1 || colSpan > 1
            ? baseHeight * rowSpan + (rowSpan - 1) * 20
            : baseHeight;
    };

    const renderCategoryBadgeContent = (category) => {
        if (!category) return null;
        const name = category.name?.trim();
        if (name === 'ছবি') return <i className="fas fa-camera" title="ছবি"></i>;
        if (name === 'ভিডিও') return <i className="fas fa-video" title="ভিডিও"></i>;
        return name;
    };

    if (loading && !news) {
        return <div className="text-center p-2"><Spinner animation="border" size="sm" /></div>;
    }

    if (!news) return null;

    const design = cell.design || 'title-image-top';
    const imageUrl = getImageUrl(news, design === 'text-inside-image' || cell.rowSpan > 1 || cell.colSpan > 1);
    const newsLink = `/news/${news._id || news.id}`;
    const imageHeight = getImageHeight();

    const NewsImage = ({ className, currentDesign }) => {
        if (!imageUrl) {
            return (
                <div className={`${className} bg-light d-flex align-items-center justify-content-center text-muted`}>
                    📰
                </div>
            );
        }

        // Side layout images are smaller (90px), top layout images are taller (180px)
        const minHeight = (currentDesign === 'title-image-left' || currentDesign === 'image-left' || currentDesign === 'title-image-right' || currentDesign === 'image-right')
            ? '90px'
            : '120px';

        return (
            <div className="news-image-container" style={{ position: 'relative', width: '100%', height: '100%', minHeight }}>
                <Image
                    src={imageUrl}
                    alt={news.newsHeadline}
                    fill
                    className={`${className} object-fit-cover`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={isPriority !== undefined ? isPriority : (cell.rowSpan > 1 || cell.colSpan > 1)} // Strictly use isPriority if provided, otherwise fallback to span logic
                    quality={90}
                />
            </div>
        );
    };

    if (design === 'text-inside-image') {
        return (
            <div className="custom-font news-design-text-inside-image h-100 overflow-hidden position-relative" style={{ minHeight: '350px' }}>
                <Link href={newsLink} className="text-decoration-none h-100 d-block">
                    <NewsImage className="text-inside-image-img h-100" currentDesign={design} />
                    <div className="text-inside-image-overlay position-absolute bottom-0 start-0 end-0 p-3">
                        <h4 className="text-white mb-2 fw-bold font-bangla text-inside-image-title ">
                            {news.alternativeHeadline || news.newsHeadline}
                        </h4>
                        <small className="text-light opacity-75">{formatDate(news.createdAt)}</small>
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


    if (design === 'title-only') {
        return (
            <div className="custom-font news-design-title-only h-100 pb-2">
                <Link href={newsLink} className="text-decoration-none text-dark">
                    <h5 className="fw-bold mb-1 font-bangla hover-primary">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                <small className="text-muted">{formatDate(news.createdAt)}</small>
            </div>
        );
    }

    if (design === 'title-image-left') {
        return (
            <div className="custom-font news-design-side-layout pb-3">
                <Link href={newsLink} className="text-decoration-none text-dark d-block mb-2">
                    <h5 className="fw-bold font-bangla mb-1">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                <div className="d-flex gap-3">
                    {imageUrl && (
                        <div className="side-image-container flex-shrink-0 position-relative" style={{ width: '120px', height: '90px' }}>
                            <Link href={newsLink} className="d-block h-100">
                                <NewsImage className="" currentDesign={design} />
                            </Link>
                            {news.Categories && news.Categories[0] && (
                                <Badge bg="danger" className="position-absolute top-0 start-0 m-1" style={{ zIndex: 2 }}>
                                    {renderCategoryBadgeContent(news.Categories[0])}
                                </Badge>
                            )}
                        </div>
                    )}
                    <div className="flex-grow-1">
                        {news.shortDescription && (
                            <p className="small text-muted mb-2 line-clamp-2 d-none d-sm-block font-bangla">{news.shortDescription}</p>
                        )}
                        <small className="text-muted">{formatDate(news.createdAt)}</small>
                    </div>
                </div>
            </div>
        );
    }

    if (design === 'image-left') {
        return (
            <div className="custom-font news-design-side-layout d-flex gap-3 pb-3">
                {imageUrl && (
                    <div className="side-image-container flex-shrink-0 position-relative" style={{ width: '120px', height: '90px' }}>
                        <Link href={newsLink} className="d-block h-100">
                            <NewsImage className="" currentDesign={design} />
                        </Link>
                        {news.Categories && news.Categories[0] && (
                            <Badge bg="danger" className="position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
                                {renderCategoryBadgeContent(news.Categories[0])}
                            </Badge>
                        )}
                    </div>
                )}
                <div className="flex-grow-1">
                    <Link href={newsLink} className="text-decoration-none text-dark">
                        <h5 className="fw-bold mb-2 font-bangla">
                            {news.alternativeHeadline || news.newsHeadline}
                        </h5>
                    </Link>
                    <small className="text-muted">{formatDate(news.createdAt)}</small>
                </div>
            </div>
        );
    }

    if (design === 'title-image-right') {
        return (
            <div className="custom-font news-design-side-layout pb-3">
                <Link href={newsLink} className="text-decoration-none text-dark d-block mb-2">
                    <h5 className="fw-bold font-bangla mb-1">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                <div className="d-flex gap-3">
                    <div className="flex-grow-1">
                        {news.shortDescription && (
                            <p className="small text-muted mb-2 line-clamp-2 d-none d-sm-block font-bangla">{news.shortDescription}</p>
                        )}
                        <small className="text-muted">{formatDate(news.createdAt)}</small>
                    </div>
                    {imageUrl && (
                        <div className="side-image-container flex-shrink-0 position-relative" style={{ width: '120px', height: '90px' }}>
                            <Link href={newsLink} className="d-block h-100">
                                <NewsImage className="" currentDesign={design} />
                            </Link>
                            {news.Categories && news.Categories[0] && (
                                <Badge bg="danger" className="position-absolute top-0 end-0 m-1" style={{ zIndex: 2 }}>
                                    {renderCategoryBadgeContent(news.Categories[0])}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (design === 'image-right') {
        return (
            <div className="custom-font news-design-side-layout d-flex gap-3 pb-3">
                <div className="flex-grow-1">
                    <Link href={newsLink} className="text-decoration-none text-dark">
                        <h5 className="fw-bold mb-2 font-bangla ">
                            {news.alternativeHeadline || news.newsHeadline}
                        </h5>
                    </Link>
                    <small className="text-muted">{formatDate(news.createdAt)}</small>
                </div>
                {imageUrl && (
                    <div className="side-image-container flex-shrink-0 position-relative" style={{ width: '120px', height: '90px' }}>
                        <Link href={newsLink} className="d-block h-100">
                            <NewsImage className="" currentDesign={design} />
                        </Link>
                        {news.Categories && news.Categories[0] && (
                            <Badge bg="danger" className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
                                {renderCategoryBadgeContent(news.Categories[0])}
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const isMerged = (cell.rowSpan || 1) > 1 || (cell.colSpan || 1) > 1;

    return (
        <Card className="h-100 custom-font border-0 news-widget-card group shadow-sm-hover transition-all" style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                className={`card-img-wrapper position-relative overflow-hidden mb-2 ${design === 'image-top' || !design ? 'news-design-image-top' : ''}`}
                style={isMerged
                    ? { flex: '1 1 auto', minHeight: '200px', display: 'flex', flexDirection: 'column' }
                    : { minHeight: `${imageHeight}px`, display: 'flex', flexDirection: 'column' }
                }
            >
                <Link href={newsLink} className="d-block h-100">
                    <NewsImage className="transition-transform group-hover-scale" currentDesign={design} />
                </Link>
                {news.Categories && news.Categories[0] && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2 shadow-sm">
                        {renderCategoryBadgeContent(news.Categories[0])}
                    </Badge>
                )}
            </div>
            <Card.Body className="p-0" style={isMerged ? { flex: '0 0 auto' } : {}}>
                <Link href={newsLink} className="text-decoration-none text-dark">
                    <h5 className="fw-bold mb-2 font-bangla news-card-title">
                        {news.alternativeHeadline || news.newsHeadline}
                    </h5>
                </Link>
                {cell.design !== 'image-top' && news.shortDescription && (
                    <p className="small text-muted line-clamp-3 mb-2 font-bangla">{news.shortDescription}</p>
                )}
                <div className="text-muted small mt-auto">
                    {formatDate(news.createdAt)}
                </div>
            </Card.Body>
        </Card>
    );
};

export default NewsWidget;
