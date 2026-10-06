'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner, Modal, Badge, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { STATIC_URL } from "@/app/lib/api";
import NextImage from 'next/image';
import useSWR from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const IMG_URL = STATIC_URL;

const PhotosListClient = ({ initialImages, initialAlbums, initialTotalPages, initialTotalCount, isAdmin }) => {
    const [showModal, setShowModal] = useState(false);
    const [editPhoto, setEditPhoto] = useState(null);
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [showConfirm, setShowConfirm] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [deleteFromFS, setDeleteFromFS] = useState(false);
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState("1");
    const [sourceFilter, setSourceFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const [formData, setFormData] = useState({ albumId: '', status: 'active', caption: '', images: null });
    const [previews, setPreviews] = useState([]);

    const swrKey = isAdmin ? `/all/images?page=${page}&limit=20&sourceType=${sourceFilter}` : null;
    
    const { data: swrData, error, isLoading: loading, mutate } = useSWR(swrKey, fetcher, {
        fallbackData: page === 1 && sourceFilter === "" ? { 
            images: initialImages, 
            pagination: { totalPages: initialTotalPages, totalCount: initialTotalCount } 
        } : undefined,
        keepPreviousData: true
    });

    const rawImages = swrData?.images || [];
    const totalPages = Math.max(1, swrData?.pagination?.totalPages || 1);
    const totalCount = swrData?.pagination?.totalCount || 0;

    // Sync inputPage when page changes
    useEffect(() => {
        setInputPage(String(page));
    }, [page]);

    // Client-side search filter on current page
    const images = searchQuery.trim()
        ? rawImages.filter(img => 
            (img.filename && img.filename.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (img.caption && img.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (img.albumName && img.albumName.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : rawImages;

    const refreshData = () => mutate();

    const handleShowModal = (photo = null) => {
        if (photo) {
            setEditPhoto(photo);
            setFormData({ albumId: photo.album?.id || photo.albumId || '', status: photo.status || 'active', caption: photo.caption || '', images: null });
            setPreviews(photo.imageUrl ? [getImageUrl(photo.imageUrl)] : []);
        } else {
            setEditPhoto(null);
            setFormData({ albumId: '', status: 'active', caption: '', images: null });
            setPreviews([]);
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, images: files });
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('albumId', formData.albumId);
        data.append('status', formData.status);
        data.append('caption', formData.caption);
        if (formData.images) {
            formData.images.forEach(file => data.append('images', file));
        }

        try {
            if (editPhoto) {
                await api.patch(`/${editPhoto.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success("Updated successfully");
            } else {
                await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success("Uploaded successfully");
            }
            setShowModal(false);
            refreshData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/registry/${imageToDelete.id}`, { data: { deleteFromFS } });
            toast.success("Deleted successfully");
            refreshData();
        } catch (err) { toast.error("Delete failed"); }
        finally { setShowConfirm(false); setDeleteFromFS(false); }
    };

    const handleConvertToPhoto = async (image) => {
        try {
            await api.post('/convert-to-photo', { registryId: image.id, caption: image.caption || '', albumId: null });
            toast.success("Converted to gallery photo");
            refreshData();
        } catch (err) { toast.error("Conversion failed"); }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `${IMG_URL}/${url.startsWith('/') ? url.substring(1) : url}`;
    };

    const handleCopyUrl = (e, img) => {
        e.stopPropagation();
        const fullUrl = getImageUrl(img.imageUrl);
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(img.id);
        toast.info("Image URL copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handlePageInputSubmit = () => {
        const p = parseInt(inputPage, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            setPage(p);
        } else {
            setInputPage(String(page));
        }
    };

    const getSourceBadgeVariant = (source) => {
        switch (source) {
            case 'photo': return 'primary';
            case 'news': return 'success';
            case 'article': return 'info';
            case 'blog': return 'warning';
            default: return 'secondary';
        }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
                <div>
                    <h4 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                        <i className="fas fa-images text-primary"></i> Photo Gallery
                    </h4>
                    <p className="text-muted mb-0 small">
                        Showing <strong>{images.length}</strong> of <strong>{totalCount}</strong> images (20 per page)
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()} 
                        className="d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                    >
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Upload Photo</span>
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="shadow-sm border-0 mb-4 bg-light">
                <Card.Body className="p-3">
                    <Row className="g-2 align-items-center">
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-bold mb-1 text-uppercase">Filter by Source</Form.Label>
                                <Form.Select 
                                    value={sourceFilter} 
                                    onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
                                    className="shadow-none border"
                                >
                                    <option value="">All Sources</option>
                                    <option value="photo">Photo Gallery</option>
                                    <option value="news">News</option>
                                    <option value="article">Articles</option>
                                    <option value="blog">Blogs</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-bold mb-1 text-uppercase">Search in page</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by filename or caption..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="shadow-none border-start-0"
                                    />
                                    {searchQuery && (
                                        <button 
                                            className="btn btn-outline-secondary border-start-0" 
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Photos Card Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Loading images...</p>
                </div>
            ) : images.length === 0 ? (
                <Card className="shadow-sm border-0 text-center py-5 my-4">
                    <Card.Body>
                        <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>
                            <i className="fas fa-image"></i>
                        </div>
                        <h5 className="fw-bold text-dark">No Images Found</h5>
                        <p className="text-muted mb-3">Try adjusting your filters or upload new photos.</p>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShowModal()}>
                            + Upload Photo
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 mb-4">
                    {images.map(img => {
                        const imgFullUrl = getImageUrl(img.imageUrl);
                        return (
                            <Col key={img.id}>
                                <Card className="h-100 shadow-sm border rounded-3 overflow-hidden d-flex flex-column transition-all" style={{ backgroundColor: '#ffffff' }}>
                                    {/* Image Container with overlay */}
                                    <div 
                                        className="position-relative bg-dark d-flex align-items-center justify-content-center overflow-hidden" 
                                        style={{ height: '180px', cursor: 'pointer' }}
                                        onClick={() => setPreviewImage(img)}
                                    >
                                        <NextImage
                                            src={imgFullUrl}
                                            alt={img.filename || "Photo"}
                                            fill
                                            className="img-fluid"
                                            style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                            unoptimized={imgFullUrl.startsWith('data:') || imgFullUrl.includes('localhost')}
                                        />

                                        {/* Source Badge Overlay */}
                                        <div className="position-absolute top-0 start-0 m-2">
                                            <Badge bg={getSourceBadgeVariant(img.source)} className="shadow-sm text-capitalize">
                                                {img.source || 'image'}
                                            </Badge>
                                        </div>

                                        {/* Album Overlay if present */}
                                        {img.albumName && (
                                            <div className="position-absolute top-0 end-0 m-2">
                                                <Badge bg="dark" className="shadow-sm bg-opacity-75">
                                                    📁 {img.albumName}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Quick Zoom on Hover */}
                                        <div 
                                            className="position-absolute bottom-0 end-0 m-2 bg-dark bg-opacity-75 text-white rounded-circle p-2 d-flex align-items-center justify-content-center"
                                            style={{ width: '30px', height: '30px', fontSize: '12px' }}
                                            title="Click to preview"
                                        >
                                            <i className="fas fa-search-plus"></i>
                                        </div>
                                    </div>

                                    {/* Card Info */}
                                    <Card.Body className="p-2 d-flex flex-column justify-content-between flex-grow-1">
                                        <div>
                                            <div 
                                                className="fw-semibold text-truncate text-dark small mb-1" 
                                                title={img.filename}
                                                style={{ fontSize: '0.85rem' }}
                                            >
                                                {img.filename || 'Untitled'}
                                            </div>
                                            
                                            {img.caption ? (
                                                <div 
                                                    className="text-muted small text-truncate mb-2" 
                                                    title={img.caption}
                                                    style={{ fontSize: '0.78rem', minHeight: '18px' }}
                                                >
                                                    {img.caption}
                                                </div>
                                            ) : (
                                                <div className="text-muted small text-truncate mb-2 fst-italic" style={{ fontSize: '0.75rem', minHeight: '18px' }}>
                                                    No caption
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between text-muted border-top pt-2 mt-auto" style={{ fontSize: '0.75rem' }}>
                                            <span>
                                                <i className="far fa-calendar-alt me-1"></i>
                                                {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-muted border-0 hover:text-primary"
                                                onClick={(e) => handleCopyUrl(e, img)}
                                                title="Copy Image URL"
                                                style={{ fontSize: '0.78rem', textDecoration: 'none' }}
                                            >
                                                {copiedId === img.id ? (
                                                    <span className="text-success"><i className="fas fa-check me-1"></i>Copied</span>
                                                ) : (
                                                    <span><i className="far fa-copy me-1"></i>Copy URL</span>
                                                )}
                                            </button>
                                        </div>
                                    </Card.Body>

                                    {/* Action Bar Footer */}
                                    <div className="card-footer bg-light p-2 border-top d-flex gap-1 justify-content-end">
                                        {img.source === 'other' && (
                                            <Button 
                                                variant="outline-success" 
                                                size="sm" 
                                                className="px-2 py-1"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleConvertToPhoto(img)}
                                                title="Add to Photo Gallery"
                                            >
                                                <i className="fas fa-plus-circle me-1"></i>To Gallery
                                            </Button>
                                        )}
                                        {img.source === 'photo' && (
                                            <Button 
                                                variant="outline-warning" 
                                                size="sm" 
                                                className="px-2 py-1 text-dark"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleShowModal(img)}
                                                title="Edit Caption & Album"
                                            >
                                                <i className="fas fa-edit me-1"></i>Edit
                                            </Button>
                                        )}
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            className="px-2 py-1"
                                            style={{ fontSize: '0.75rem' }}
                                            onClick={() => { setImageToDelete(img); setShowConfirm(true); }}
                                            title="Delete Image"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Custom Pagination Exactly Matching the Screenshot Design */}
            {totalPages > 0 && (
                <div className="d-flex justify-content-center align-items-center py-4 my-2">
                    <div 
                        className="d-flex align-items-center gap-3 px-3 py-2"
                        style={{
                            userSelect: 'none'
                        }}
                    >
                        {/* Previous Button `<` */}
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            aria-label="Previous Page"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: page <= 1 ? '#f1f5f9' : '#eef2f6',
                                color: page <= 1 ? '#94a3b8' : '#0284c7',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: '18px',
                                fontWeight: '600',
                                transition: 'all 0.15s ease',
                                outline: 'none',
                                opacity: page <= 1 ? 0.7 : 1
                            }}
                        >
                            <span style={{ position: 'relative', top: '-1px' }}>&lsaquo;</span>
                        </button>

                        {/* Page X of Y text */}
                        <div 
                            style={{ 
                                fontSize: '15px', 
                                color: '#475569', 
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <span>Page</span>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{page}</span>
                            <span>of</span>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{totalPages}</span>
                        </div>

                        {/* Page Jump Input Box */}
                        <div>
                            <input
                                type="number"
                                min={1}
                                max={totalPages}
                                value={inputPage}
                                onChange={(e) => setInputPage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handlePageInputSubmit();
                                    }
                                }}
                                onBlur={handlePageInputSubmit}
                                aria-label="Current Page"
                                style={{
                                    width: '84px',
                                    height: '38px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #cbd5e1',
                                    backgroundColor: '#ffffff',
                                    color: '#0284c7',
                                    textAlign: 'center',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    outline: 'none',
                                    transition: 'border-color 0.15s ease',
                                    padding: '0 8px'
                                }}
                            />
                        </div>

                        {/* Next Button `>` */}
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            aria-label="Next Page"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                border: '1.5px solid #bfdbfe',
                                backgroundColor: '#ffffff',
                                color: page >= totalPages ? '#94a3b8' : '#0284c7',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '18px',
                                fontWeight: '600',
                                transition: 'all 0.15s ease',
                                outline: 'none',
                                opacity: page >= totalPages ? 0.6 : 1
                            }}
                        >
                            <span style={{ position: 'relative', top: '-1px' }}>&rsaquo;</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Full Preview Lightbox */}
            <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6 text-truncate pe-3">
                        {previewImage?.filename || 'Image Preview'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 text-center bg-dark">
                    {previewImage && (
                        <div className="position-relative" style={{ minHeight: '350px', maxHeight: '70vh', width: '100%' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageUrl(previewImage.imageUrl)}
                                alt={previewImage.filename || 'Preview'}
                                style={{ maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }}
                                className="img-fluid"
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <div className="text-start">
                        {previewImage?.caption && (
                            <p className="mb-1 small fw-semibold text-dark">{previewImage.caption}</p>
                        )}
                        <small className="text-muted d-block">
                            Source: <Badge bg={getSourceBadgeVariant(previewImage?.source)}>{previewImage?.source}</Badge>
                            {previewImage?.albumName && <span className="ms-2">Album: {previewImage.albumName}</span>}
                        </small>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={(e) => previewImage && handleCopyUrl(e, previewImage)}
                        >
                            <i className="far fa-copy me-1"></i>Copy URL
                        </Button>
                        <a 
                            href={previewImage ? getImageUrl(previewImage.imageUrl) : '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fas fa-external-link-alt me-1"></i>Open Original
                        </a>
                        <Button variant="secondary" size="sm" onClick={() => setPreviewImage(null)}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Modal: Upload & Edit Photo */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editPhoto ? 'Edit Photo' : 'Upload Photos'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Album</Form.Label>
                            <Form.Select 
                                value={formData.albumId} 
                                onChange={e => setFormData({ ...formData, albumId: e.target.value })} 
                                required
                            >
                                <option value="">Select Album</option>
                                {albums.map(a => (
                                    <option key={a.id || a._id} value={a.id || a._id}>
                                        {a.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image {editPhoto && '(Leave empty to keep current)'}</Form.Label>
                            <Form.Control 
                                type="file" 
                                multiple={!editPhoto} 
                                accept="image/*"
                                onChange={handleFileChange} 
                                required={!editPhoto}
                            />
                        </Form.Group>
                        {previews.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {previews.map((p, i) => (
                                    <div key={i} style={{ position: 'relative', width: '80px', height: '60px' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="rounded border" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Caption</Form.Label>
                            <Form.Control 
                                placeholder="Enter photo caption..."
                                value={formData.caption} 
                                onChange={e => setFormData({ ...formData, caption: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select 
                                value={formData.status} 
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">
                            {editPhoto ? 'Save Changes' : 'Upload'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal: Delete Confirmation */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2">Are you sure you want to delete this image from the registry?</p>
                    {imageToDelete && (
                        <div className="p-2 bg-light rounded border mb-3 small text-truncate">
                            <strong>File:</strong> {imageToDelete.filename}
                        </div>
                    )}
                    <Form.Check 
                        type="checkbox" 
                        id="deleteFromFSCheck"
                        label="Also permanently delete from filesystem disk" 
                        checked={deleteFromFS} 
                        onChange={e => setDeleteFromFS(e.target.checked)} 
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PhotosListClient;
