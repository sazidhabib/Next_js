'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button, Form, Row, Col, Card, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { STATIC_URL, sanitizeImageUrl } from '@/app/lib/api';

const getImageUrl = (url) => sanitizeImageUrl(url) || url;

const getSourceLabel = (source) => {
    switch (source) {
        case 'article': return 'Article';
        case 'blog': return 'Blog';
        case 'news': return 'News';
        case 'photo': return 'Photo';
        default: return 'Other';
    }
};

const getSourceBadgeColor = (source) => {
    switch (source) {
        case 'photo': return 'success';
        case 'news': return 'primary';
        case 'article': return 'info';
        case 'blog': return 'warning';
        default: return 'secondary';
    }
};

export default function MediaPickerModal({
    show,
    onClose,
    onSelect,
    title = 'Select Media Image',
    initialSource = 'all'
}) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [limit] = useState(16);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sourceType, setSourceType] = useState(initialSource);
    const [inputPage, setInputPage] = useState('1');

    // Upload state
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCaption, setUploadCaption] = useState('');
    const [uploadAlbumId, setUploadAlbumId] = useState('');
    const [albums, setAlbums] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 350);
        return () => clearTimeout(handler);
    }, [search]);

    // Keep inputPage synced
    useEffect(() => {
        setInputPage(String(page));
    }, [page]);

    // Fetch albums once when modal opens
    useEffect(() => {
        if (!show) return;
        api.get('/albums')
            .then(res => setAlbums(res.data.albums || res.data || []))
            .catch(() => setAlbums([]));
    }, [show]);

    // Fetch paginated photos from server
    const fetchPhotos = useCallback(async () => {
        if (!show) return;
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                ...(sourceType !== 'all' ? { sourceType } : {}),
                ...(debouncedSearch ? { search: debouncedSearch } : {})
            };

            const res = await api.get('/all/images', { params });
            const rawImages = res.data.images || [];

            const valid = rawImages
                .filter(p => p && (p.imageUrl || p.image) && p.filename)
                .map(p => ({
                    id: p.id,
                    filename: p.filename,
                    imageUrl: p.imageUrl || p.image,
                    caption: p.caption || '',
                    albumId: p.albumId || p.photo?.albumId || null,
                    albumName: p.albumName || p.photo?.albumName || '',
                    source: p.source || p.sourceType || 'other',
                    createdAt: p.createdAt
                }));

            setPhotos(valid);
            setTotalPages(Math.max(1, res.data.pagination?.totalPages || 1));
            setTotalCount(res.data.pagination?.totalCount || valid.length);
        } catch (err) {
            console.error('Error fetching images:', err);
            toast.error('Failed to load images from media library');
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    }, [show, page, limit, sourceType, debouncedSearch]);

    useEffect(() => {
        if (show) {
            fetchPhotos();
        }
    }, [show, fetchPhotos]);

    // Handle Page Jump
    const handlePageInputSubmit = () => {
        const p = parseInt(inputPage, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            setPage(p);
        } else {
            setInputPage(String(page));
        }
    };

    // Quick Upload inside modal
    const handleUpload = async () => {
        if (!uploadFile) {
            toast.warning('Please select an image file to upload');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('images', uploadFile);
        if (uploadAlbumId) data.append('albumId', uploadAlbumId);
        if (uploadCaption) data.append('caption', uploadCaption);

        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Image uploaded successfully!');
            setUploadFile(null);
            setUploadCaption('');
            setShowUpload(false);

            // If backend returned the uploaded photo, can select directly
            const uploadedPhoto = res.data?.photos?.[0] || res.data?.photo;
            if (uploadedPhoto && (uploadedPhoto.imageUrl || uploadedPhoto.image)) {
                onSelect({
                    id: uploadedPhoto.id,
                    filename: uploadedPhoto.filename || uploadFile.name,
                    imageUrl: uploadedPhoto.imageUrl || uploadedPhoto.image,
                    caption: uploadedPhoto.caption || uploadCaption,
                    source: 'photo'
                });
                onClose();
                return;
            }

            // Otherwise refresh to page 1
            setPage(1);
            fetchPhotos();
        } catch (err) {
            console.error('Upload failed:', err);
            toast.error(err.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="xl" centered scrollable className="media-picker-modal">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-images text-teal-600 fs-5"></i>
                    <Modal.Title className="fs-5 fw-bold mb-0">{title}</Modal.Title>
                    {totalCount > 0 && (
                        <Badge bg="secondary" className="ms-2">
                            {totalCount.toLocaleString()} Total
                        </Badge>
                    )}
                </div>
            </Modal.Header>

            <Modal.Body className="p-3">
                {/* Top Action Bar: Upload toggle, Source Filter, Search Box */}
                <div className="d-flex flex-column gap-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <Button
                            variant={showUpload ? "outline-secondary" : "outline-primary"}
                            size="sm"
                            onClick={() => setShowUpload(!showUpload)}
                            className="d-flex align-items-center gap-2"
                        >
                            <i className={`fas fa-${showUpload ? 'times' : 'cloud-upload-alt'}`}></i>
                            <span>{showUpload ? 'Cancel Upload' : 'Upload New Image'}</span>
                        </Button>

                        <div className="small text-muted">
                            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({photos.length} visible)
                        </div>
                    </div>

                    {/* Inline Upload Drawer */}
                    {showUpload && (
                        <div className="card p-3 border shadow-sm rounded-3">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <i className="fas fa-upload text-teal-600"></i> Fast Image Upload
                            </h6>
                            <Row className="g-2">
                                <Col md={5}>
                                    <Form.Group>
                                        <Form.Label className="small mb-1 fw-semibold">Select File *</Form.Label>
                                        <Form.Control
                                            type="file"
                                            size="sm"
                                            accept="image/*"
                                            onChange={e => setUploadFile(e.target.files[0])}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small mb-1 fw-semibold">Caption / Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            placeholder="Optional caption..."
                                            value={uploadCaption}
                                            onChange={e => setUploadCaption(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="d-flex align-items-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-100 py-1 d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleUpload}
                                        disabled={uploading || !uploadFile}
                                    >
                                        {uploading ? (
                                            <>
                                                <Spinner size="sm" animation="border" />
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check"></i>
                                                <span>Upload & Choose</span>
                                            </>
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Search & Filter Controls */}
                    <Row className="g-2">
                        <Col sm={4} md={3}>
                            <Form.Select
                                size="sm"
                                value={sourceType}
                                onChange={e => {
                                    setSourceType(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="all">All Sources</option>
                                <option value="news">News Articles</option>
                                <option value="photo">Photo Gallery</option>
                                <option value="article">Articles</option>
                                <option value="blog">Blog Posts</option>
                                <option value="other">Other / System</option>
                            </Form.Select>
                        </Col>
                        <Col sm={8} md={9}>
                            <InputGroup size="sm">
                                <InputGroup.Text>
                                    <i className="fas fa-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by filename or title (e.g. cricket, banner, lead)..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSearch('')}
                                        title="Clear search"
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>
                    </Row>
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="teal" role="status" />
                        <div className="text-muted small mt-2">Loading images from archive...</div>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-5 border rounded-3 card bg-transparent">
                        <i className="far fa-images text-muted fs-1 mb-2"></i>
                        <h6 className="fw-bold text-muted mb-1">No images found</h6>
                        <p className="text-muted small mb-3">
                            {debouncedSearch
                                ? `No results matching "${debouncedSearch}". Try another keyword.`
                                : 'No images currently exist in this category.'}
                        </p>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="mx-auto"
                            onClick={() => setShowUpload(true)}
                        >
                            Upload a photo now
                        </Button>
                    </div>
                ) : (
                    <Row className="row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 mb-3">
                        {photos.map(photo => {
                            const fullUrl = getImageUrl(photo.imageUrl);
                            return (
                                <Col key={photo.id}>
                                    <Card
                                        className="h-100 card-hover shadow-sm border overflow-hidden cursor-pointer position-relative"
                                        onClick={() => {
                                            onSelect(photo);
                                            onClose();
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        title={`Click to select: ${photo.filename}`}
                                    >
                                        <div
                                            className="position-relative bg-dark d-flex align-items-center justify-content-center overflow-hidden"
                                            style={{ height: '140px' }}
                                        >
                                            <img
                                                src={fullUrl}
                                                alt={photo.filename || 'Media'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/300x200?text=Image+Unavailable';
                                                }}
                                            />
                                            <Badge
                                                bg={getSourceBadgeColor(photo.source)}
                                                className="position-absolute top-0 end-0 m-1 shadow-sm"
                                                style={{ fontSize: '0.65rem' }}
                                            >
                                                {getSourceLabel(photo.source)}
                                            </Badge>
                                        </div>
                                        <Card.Body className="p-2 d-flex flex-column justify-content-between">
                                            <div
                                                className="small fw-semibold text-truncate mb-1"
                                                style={{ fontSize: '0.8rem' }}
                                                title={photo.filename}
                                            >
                                                {photo.filename}
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                                                <span>
                                                    {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Recent'}
                                                </span>
                                                <span className="text-teal-600 fw-medium">Select &rarr;</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Modal.Body>

            {/* Pagination Controls in Footer */}
            <Modal.Footer className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                    Cancel
                </Button>

                {totalPages > 1 && (
                    <div className="d-flex align-items-center gap-2">
                        {/* Previous Button */}
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            className="px-2 py-1"
                            title="Previous Page"
                        >
                            &lsaquo; Prev
                        </Button>

                        {/* Page X of Y */}
                        <div className="small fw-semibold mx-1">
                            Page <span className="text-primary">{page}</span> of <span>{totalPages}</span>
                        </div>

                        {/* Jump to page */}
                        <Form.Control
                            type="number"
                            min={1}
                            max={totalPages}
                            value={inputPage}
                            onChange={e => setInputPage(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handlePageInputSubmit();
                            }}
                            onBlur={handlePageInputSubmit}
                            size="sm"
                            style={{ width: '54px', textAlign: 'center', padding: '2px 4px' }}
                            title="Type page and press Enter"
                        />

                        {/* Next Button */}
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-2 py-1"
                            title="Next Page"
                        >
                            Next &rsaquo;
                        </Button>
                    </div>
                )}
            </Modal.Footer>
        </Modal>
    );
}
