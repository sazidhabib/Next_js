'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Card, Spinner, InputGroup, Image, Badge } from 'react-bootstrap';
import api, { STATIC_URL } from "@/app/lib/api";
import { toast } from 'react-toastify';

const UPLOADS_BASE_URL = STATIC_URL || 'http://localhost:5000';

// Helper to build a correct image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path.replace(/^http:\/\//, 'https://');
    return `${UPLOADS_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

export const NewsSelectionModal = ({ show, onClose, onSelect }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12,
                ...(searchTerm && { search: searchTerm })
            };
            const res = await api.get('/news', { params });
            const data = res.data.news || res.data.rows || res.data.data || res.data || [];
            setNews(Array.isArray(data) ? data : []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            toast.error('Failed to load news');
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (show) fetchNews(); }, [show, currentPage, searchTerm]);

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton><Modal.Title>Select News</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control type="text" placeholder="Search news..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </InputGroup>
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <div className="row">
                        {news.map(item => (
                            <div key={item.id} className="col-md-6 mb-3">
                                <Card onClick={() => onSelect(item)} style={{ cursor: 'pointer' }} className="h-100">
                                    {(item.thumbImage || item.image) && (
                                        <div style={{ height: '120px', overflow: 'hidden' }}>
                                            <Image
                                                src={getImageUrl(item.thumbImage || item.image)}
                                                fluid
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <Card.Body>
                                        <h6>{item.newsHeadline}</h6>
                                        <p className="small text-muted mb-1 text-truncate">{item.shortDescription}</p>
                                        <Badge bg="secondary">{item.status}</Badge>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
                {news.length === 0 && !loading && (
                    <div className="text-center text-muted py-4">No news found</div>
                )}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                        <span className="mx-3 align-self-center">Page {currentPage} of {totalPages}</span>
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export const ImageSelectionModal = ({ show, onClose, onSelect }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 12 };
            const res = await api.get('/images/all', { params });
            const data = res.data.images || [];
            setImages(data);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (error) {
            toast.error('Failed to load images');
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (show) fetchImages(); }, [show, currentPage]);

    const filteredImages = searchTerm
        ? images.filter(img =>
            (img.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (img.caption || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        : images;

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton><Modal.Title>Select Image</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control type="text" placeholder="Search images..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </InputGroup>
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <div className="row">
                        {filteredImages.map(img => (
                            <div key={img.id} className="col-md-3 mb-3">
                                <Card onClick={() => onSelect(img)} style={{ cursor: 'pointer' }} className="h-100">
                                    <div style={{ height: '150px', overflow: 'hidden' }}>
                                        <Image
                                            src={getImageUrl(img.imageUrl || img.image)}
                                            fluid
                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                            onError={e => { e.target.src = 'https://placehold.co/300x200?text=Image'; }}
                                        />
                                    </div>
                                    <Card.Body className="p-2">
                                        <small className="text-truncate d-block" title={img.filename}>{img.filename}</small>
                                        {img.caption && <small className="text-muted d-block text-truncate" title={img.caption}>{img.caption}</small>}
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
                {filteredImages.length === 0 && !loading && (
                    <div className="text-center text-muted py-4">No images found</div>
                )}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                        <span className="mx-3 align-self-center">Page {currentPage} of {totalPages}</span>
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export const VideoSelectionModal = ({ show, onClose, onSelect }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await api.get('/news', { params: { categories: 'video,ভিডিও', limit: 20 } });
            const data = res.data.news || res.data.rows || [];
            setVideos(data);
        } catch (error) {
            toast.error('Failed to load videos');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (show) fetchVideos(); }, [show]);

    const filtered = searchTerm
        ? videos.filter(v =>
            (v.newsHeadline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (v.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        : videos;

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton><Modal.Title>Select Video Content</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control type="text" placeholder="Search video content..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </InputGroup>
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <div className="row">
                        {filtered.map(v => (
                            <div key={v.id} className="col-md-6 mb-3">
                                <Card onClick={() => onSelect(v)} style={{ cursor: 'pointer' }} className="h-100">
                                    {v.image && (
                                        <div style={{ height: '150px', overflow: 'hidden' }}>
                                            <Image
                                                src={getImageUrl(v.image)}
                                                fluid
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <Card.Body>
                                        <h6>{v.newsHeadline}</h6>
                                        <p className="small text-muted">{v.shortDescription?.substring(0, 100)}...</p>
                                        <div>
                                            <Badge bg="info" className="me-2">Video</Badge>
                                            <Badge bg="secondary">{v.status}</Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
                {filtered.length === 0 && !loading && (
                    <div className="text-center text-muted py-4">No video content found</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export const AdSelectionModal = ({ show, onClose, onSelect }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12,
                ...(searchTerm && { search: searchTerm })
            };
            const res = await api.get('/ads', { params });
            const data = res.data.ads || res.data.data || res.data || [];
            setAds(Array.isArray(data) ? data : []);
            setTotalPages(res.data.totalPages || Math.ceil((Array.isArray(data) ? data.length : 0) / 12) || 1);
        } catch (error) {
            toast.error('Failed to load ads');
            setAds([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (show) fetchAds(); }, [show, currentPage, searchTerm]);

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton><Modal.Title>Select Ad</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control type="text" placeholder="Search ads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </InputGroup>
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <div className="row">
                        {ads.map(ad => (
                            <div key={ad.id} className="col-md-6 mb-3">
                                <Card onClick={() => onSelect(ad)} style={{ cursor: 'pointer' }} className="h-100">
                                    {ad.image && (
                                        <div style={{ height: '150px', overflow: 'hidden' }}>
                                            <Image
                                                src={getImageUrl(`uploads/ads/${ad.image}`)}
                                                fluid
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <Card.Body>
                                        <h6>{ad.title || ad.name || ad.description?.substring(0, 50) || `Ad ${ad.id}`}</h6>
                                        {ad.description && <p className="small text-muted">{ad.description.substring(0, 100)}...</p>}
                                        <div>
                                            <Badge bg={ad.isActive ? 'success' : 'secondary'}>{ad.isActive ? 'Active' : 'Inactive'}</Badge>
                                            {ad.type && <Badge bg="info" className="ms-2">{ad.type}</Badge>}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
                {ads.length === 0 && !loading && (
                    <div className="text-center text-muted py-4">No ads found</div>
                )}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                        <span className="mx-3 align-self-center">Page {currentPage} of {totalPages}</span>
                        <Button size="sm" variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};
