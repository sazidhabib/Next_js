import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoadMoreNews = ({ slug, excludeIds }) => {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Reset state when slug or excludeIds change
        setNews([]);
        setPage(1);
        setHasMore(true);
        fetchNews(1, true);
    }, [slug, JSON.stringify(excludeIds)]);

    const fetchNews = async (pageNum, isInitial = false) => {
        if (!hasMore && !isInitial) return;

        try {
            setLoading(true);
            const excludeIdsParam = excludeIds && excludeIds.length > 0 ? excludeIds.join(',') : '';

            const response = await axios.get(`${API_BASE_URL}/api/news`, {
                params: {
                    categories: slug,
                    limit: 10,
                    page: pageNum,
                    status: 'published',
                    excludeIds: excludeIdsParam
                }
            });

            const newNews = response.data.news || response.data.rows || [];
            const { totalPages, currentPage } = response.data;

            if (isInitial) {
                setNews(newNews);
            } else {
                setNews(prev => [...prev, ...newNews]);
            }

            if (newNews.length === 0 || currentPage >= totalPages) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching remaining news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage);
    };

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

    if (news.length === 0 && !loading) return null;

    return (
        <section className="py-4 bg-white mt-4 border-top">
            <Container>
                <div className="section-header mb-4">
                    <div className="section-title-with-lines">
                        <h2 className="title-text font-bangla">আরও খবর</h2>
                    </div>
                </div>

                <div className="row g-4">
                    {news.map((item, index) => {
                        const imageUrl = getImageUrl(item);
                        const newsLink = `/news/${item._id || item.id}`;

                        return (
                            <div key={item.id || index} className="col-lg-6 col-6 mb-3">
                                {/* Desktop Layout */}
                                <div className="d-none d-md-block news-design-title-image-side h-100 p-3 border rounded shadow-sm bg-white hover-shadow transition" style={{ transition: 'all 0.3s ease' }}>
                                    <Link to={newsLink} className="text-decoration-none text-dark">
                                        <h5 className="fw-bold mb-3 code-font-bangla hover-danger" style={{ lineHeight: '1.5' }}>
                                            {item.alternativeHeadline || item.newsHeadline}
                                        </h5>
                                    </Link>
                                    <div className="d-flex gap-3">
                                        {imageUrl && (
                                            <div className="news-side-image-wrapper flex-shrink-0 position-relative" style={{ width: '140px', height: '95px' }}>

                                                <Link to={newsLink}>
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.newsHeadline}
                                                        className="w-100 h-100 object-fit-cover rounded news-side-image"
                                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                                    />
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                            {item.shortDescription && (
                                                <p className="small custom-font text-muted mb-2 code-font-bangla" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {item.shortDescription}
                                                </p>
                                            )}
                                            <div className="small text-muted mt-auto" style={{ fontSize: '0.8rem' }}>
                                                <i className="bi bi-clock me-1"></i>
                                                {formatDate(item.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mobile Layout: Image Top */}
                                <div className="d-flex d-md-none flex-column h-100 p-2 border rounded shadow-sm bg-white hover-shadow transition" style={{ transition: 'all 0.3s ease' }}>
                                    {imageUrl && (
                                        <div className="mb-2 w-100 position-relative" style={{ aspectRatio: '16/9' }}>
                                            <Link to={newsLink}>
                                                <img
                                                    src={imageUrl}
                                                    alt={item.newsHeadline}
                                                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover rounded"
                                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                                />
                                            </Link>
                                        </div>
                                    )}
                                    <Link to={newsLink} className="text-decoration-none text-dark flex-grow-1">
                                        <h6 className="fw-bold mb-2 code-font-bangla hover-danger" style={{ lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.alternativeHeadline || item.newsHeadline}
                                        </h6>
                                    </Link>
                                    <div className="small text-muted mt-2" style={{ fontSize: '0.75rem' }}>
                                        <i className="bi bi-clock me-1"></i>
                                        {formatDate(item.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="danger" />
                    </div>
                )}

                {hasMore && !loading && news.length > 0 && (
                    <div className="text-center mt-5 mb-3">
                        <Button
                            variant="outline-danger"
                            size="lg"
                            className="px-5 py-2 rounded-pill fw-bold font-bangla border-2"
                            onClick={handleLoadMore}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>আরও লোড করুন
                        </Button>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default LoadMoreNews;
