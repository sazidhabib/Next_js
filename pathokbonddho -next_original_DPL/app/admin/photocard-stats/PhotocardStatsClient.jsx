'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Spinner, Button, Badge, Form, Modal } from 'react-bootstrap';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";
import { toast } from 'react-toastify';
import api, { STATIC_URL } from '@/app/lib/api';

export default function PhotocardStatsClient({ initialStats, isAdmin }) {
    const swrKey = isAdmin ? '/photocards/stats' : null;

    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState('1');
    const [filterType, setFilterType] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    const imagesSwrKey = isAdmin 
        ? `/photocards/images?page=${page}&limit=30&type=${filterType}&action=${filterAction}`
        : null;
    
    const { data: stats, isLoading } = useSWR(swrKey, fetcher, {
        fallbackData: initialStats,
        keepPreviousData: true
    });

    const { data: images, isLoading: isImagesLoading } = useSWR(imagesSwrKey, fetcher, {
        keepPreviousData: true
    });

    if (!isAdmin) {
        return <div className="p-4 text-center"><h4>Access Denied</h4></div>;
    }

    const totalDownloads = stats?.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0) || 0;
    const totalShares = stats?.reduce((acc, curr) => acc + (curr.shareCount || 0), 0) || 0;
    
    // Find top card
    let topCardName = 'None';
    let maxDownloads = -1;
    if (stats && stats.length > 0) {
        stats.forEach(item => {
            if ((item.downloadCount || 0) > maxDownloads) {
                maxDownloads = item.downloadCount;
                topCardName = item.name;
            }
        });
    }

    const handleRefresh = () => {
        mutate(swrKey);
        if (imagesSwrKey) mutate(imagesSwrKey);
        toast.info("Stats refreshed");
    };

    const handleDeleteImage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this photocard photo? This will delete both the database record and the file from disk.")) return;
        try {
            await api.delete(`/photocards/images/${id}`);
            toast.success("Image deleted successfully");
            mutate(imagesSwrKey);
        } catch (err) {
            console.error("Delete photocard error:", err);
            toast.error(err.response?.data?.message || "Failed to delete image");
        }
    };

    // Extract paginated images data from the SWR response
    const imagesList = images?.images || [];
    const totalCount = images?.totalCount || 0;
    const totalPages = images?.totalPages || 1;
    const typeCounts = images?.typeCounts || {};

    // Sync inputPage state when page changes
    useEffect(() => {
        setInputPage(page.toString());
    }, [page]);

    const handlePageInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handlePageInputBlur = () => {
        const val = parseInt(inputPage);
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
            setPage(val);
        } else {
            setInputPage(page.toString());
        }
    };

    const handlePageInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            const val = parseInt(inputPage);
            if (!isNaN(val) && val >= 1 && val <= totalPages) {
                setPage(val);
            } else {
                setInputPage(page.toString());
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Photocard Download Statistics</h4>
                <Button variant="outline-primary" onClick={handleRefresh} disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" animation="border" /> : <i className="fas fa-sync-alt me-1"></i>} Refresh Stats
                </Button>
            </div>

            {/* Stat Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-primary text-white mb-3">
                        <Card.Body>
                            <Card.Title>Total Downloads</Card.Title>
                            <h2>{totalDownloads}</h2>
                            <small>Overall photocard files saved by readers</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-success text-white mb-3">
                        <Card.Body>
                            <Card.Title>Total Shares</Card.Title>
                            <h2>{totalShares}</h2>
                            <small>Photocards shared to Facebook</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-info text-white mb-3">
                        <Card.Body>
                            <Card.Title>Top Performing</Card.Title>
                            <h2 style={{ fontSize: '1.4rem', margin: '8px 0' }}>{topCardName}</h2>
                            <small>{maxDownloads >= 0 ? `${maxDownloads} downloads` : 'No data'}</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Data Table */}
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Photocard Name</th>
                                    <th>Identifier (Slug)</th>
                                    <th className="text-center">Download Count</th>
                                    <th className="text-center">Share Count</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && !stats ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <Spinner animation="border" />
                                        </td>
                                    </tr>
                                ) : stats && stats.length > 0 ? (
                                    stats.map(item => (
                                        <tr key={item.id}>
                                            <td><strong>{item.name}</strong></td>
                                            <td><code>{item.type}</code></td>
                                            <td className="text-center fw-bold text-primary">{item.downloadCount || 0}</td>
                                            <td className="text-center fw-bold text-success">{item.shareCount || 0}</td>
                                            <td>{new Date(item.updatedAt).toLocaleString('en-US')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No statistics records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Grid Preview Section */}
            <Card className="shadow-sm mt-5 mb-5 border-0">
                <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-3 text-dark fw-bold">
                        Downloaded & Shared Photos Gallery
                        {totalCount > 0 && (
                            <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.85rem' }}>
                                Total: {totalCount}
                            </Badge>
                        )}
                    </h5>
                    
                    {/* Filters */}
                    <div className="d-flex gap-3 mb-3 flex-wrap">
                        <Form.Group className="d-flex align-items-center">
                            <Form.Label className="me-2 mb-0 text-muted small">Type:</Form.Label>
                            <Form.Select 
                                size="sm" 
                                value={filterType} 
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setPage(1);
                                }}
                                style={{ borderRadius: '6px', minWidth: '240px' }}
                            >
                                <option value="all">All Types ({typeCounts['all'] || 0})</option>
                                <option value="pathokbonddho-photocard">পাঠকবন্ধু ফটোকার্ড ({typeCounts['pathokbonddho-photocard'] || 0})</option>
                                <option value="ajp-photocard">আজকের পত্রিকা ফটোকার্ড ({typeCounts['ajp-photocard'] || 0})</option>
                                <option value="ajp-profile">প্রোফাইল পিকচার ({typeCounts['ajp-profile'] || 0})</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center">
                            <Form.Label className="me-2 mb-0 text-muted small">Action:</Form.Label>
                            <Form.Select 
                                size="sm" 
                                value={filterAction} 
                                onChange={(e) => {
                                    setFilterAction(e.target.value);
                                    setPage(1);
                                }}
                                style={{ borderRadius: '6px', minWidth: '120px' }}
                            >
                                <option value="all">All Actions</option>
                                <option value="download">Download</option>
                                <option value="share">Facebook Share</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </Card.Header>
                <Card.Body className="pt-2">
                    {isImagesLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2 text-muted">Loading preview gallery...</div>
                        </div>
                    ) : imagesList && imagesList.length > 0 ? (
                        <>
                            <Row className="g-2 g-sm-3">
                                {imagesList.map(img => {
                                    const imgBaseUrl = STATIC_URL || 'http://localhost:5000';
                                    const fullImgUrl = img.imageUrl.startsWith('http') 
                                        ? img.imageUrl 
                                        : `${imgBaseUrl}/${img.imageUrl.replace(/^\/+/, '')}`;
                                    
                                    // Determine display label and color
                                    let typeLabel = img.photocardType;
                                    let typeColor = 'secondary';
                                    if (img.photocardType === 'pathokbonddho-photocard') {
                                        typeLabel = 'পাঠকবন্ধু ফটোকার্ড';
                                        typeColor = 'success';
                                    } else if (img.photocardType === 'ajp-photocard') {
                                        typeLabel = 'আজকের পত্রিকা ফটোকার্ড';
                                        typeColor = 'primary';
                                    } else if (img.photocardType === 'ajp-profile') {
                                        typeLabel = 'প্রোফাইল পিকচার';
                                        typeColor = 'warning';
                                    }

                                    return (
                                        <Col key={img.id} xs={6} sm={6} md={4} lg={3} className="mb-2 mb-sm-3">
                                            <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden photocard-preview-card" style={{ transition: 'all 0.3s ease', borderRadius: '12px' }}>
                                                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={fullImgUrl} 
                                                        alt="Generated Photocard" 
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                                                        loading="lazy"
                                                    />
                                                    <div className="photocard-overlay">
                                                        <Button 
                                                            variant="light" 
                                                            size="sm" 
                                                            className="me-2 fw-semibold" 
                                                            onClick={() => setSelectedImage(img)}
                                                        >
                                                            <i className="fas fa-eye me-1"></i> View
                                                        </Button>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            className="fw-semibold"
                                                            onClick={() => handleDeleteImage(img.id)}
                                                        >
                                                            <i className="fas fa-trash-alt me-1"></i> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Card.Body className="p-2 p-sm-3" style={{ fontSize: '0.85rem' }}>
                                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                                        <Badge bg={typeColor} className="text-white">
                                                            {typeLabel}
                                                        </Badge>
                                                        <Badge bg={img.action === 'share' ? 'info' : 'primary'} className="text-white">
                                                            {img.action === 'share' ? 'Share' : 'Download'}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-muted small">
                                                        <i className="far fa-clock me-1"></i>
                                                        {new Date(img.createdAt).toLocaleString('en-US')}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {/* Responsive Pagination Component */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pt-3 border-top flex-wrap">
                                    <Button 
                                        variant="light" 
                                        disabled={page <= 1} 
                                        onClick={() => setPage(page - 1)}
                                        className="border shadow-sm px-3 d-flex align-items-center justify-content-center"
                                        style={{ height: '38px', minWidth: '38px', borderRadius: '6px' }}
                                    >
                                        &lt;
                                    </Button>
                                    
                                    <span className="mx-2 text-muted" style={{ fontSize: '0.95rem' }}>
                                        Page <strong className="text-dark">{page}</strong> of <strong className="text-dark">{totalPages}</strong>
                                    </span>
                                    
                                    <Form.Control
                                        type="number"
                                        value={inputPage}
                                        onChange={handlePageInputChange}
                                        onBlur={handlePageInputBlur}
                                        onKeyDown={handlePageInputKeyDown}
                                        className="text-center shadow-sm"
                                        style={{ width: '70px', height: '38px', borderRadius: '6px' }}
                                        min={1}
                                        max={totalPages}
                                    />
                                    
                                    <Button 
                                        variant="light" 
                                        disabled={page >= totalPages} 
                                        onClick={() => setPage(page + 1)}
                                        className="border shadow-sm px-3 d-flex align-items-center justify-content-center text-primary"
                                        style={{ height: '38px', minWidth: '38px', borderRadius: '6px' }}
                                    >
                                        &gt;
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5 text-muted border rounded-3 bg-light">
                            <i className="far fa-image mb-2" style={{ fontSize: '2rem' }}></i>
                            <div>No matching photocard images found.</div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Modal for full-size photocard preview */}
            <Modal 
                show={!!selectedImage} 
                onHide={() => setSelectedImage(null)} 
                centered 
                size="lg"
                contentClassName="border-0 shadow-lg"
                style={{ backdropFilter: 'blur(5px)' }}
            >
                {selectedImage && (
                    <>
                        <Modal.Header closeButton className="border-0 pb-0">
                            <Modal.Title className="fs-5 text-muted">
                                Photocard Preview
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center pt-0">
                            <div className="position-relative mb-3 border rounded overflow-hidden shadow-sm mx-auto" style={{ maxWidth: '600px', aspectRatio: '1/1', backgroundColor: '#f8f9fa' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={
                                        selectedImage.imageUrl.startsWith('http') 
                                            ? selectedImage.imageUrl 
                                            : `${STATIC_URL || 'http://localhost:5000'}/${selectedImage.imageUrl.replace(/^\/+/, '')}`
                                    } 
                                    alt="Full Preview" 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            
                            <div className="d-flex justify-content-center gap-4 flex-wrap mb-2">
                                <div>
                                    <span className="text-muted d-block small">Type</span>
                                    <strong className="text-dark">
                                        {selectedImage.photocardType === 'pathokbonddho-photocard' ? 'পাঠকবন্ধু ফটোকার্ড' : 
                                         selectedImage.photocardType === 'ajp-photocard' ? 'আজকের পত্রিকা ফটোকার্ড' : 
                                         selectedImage.photocardType === 'ajp-profile' ? 'প্রোফাইল পিকচার' : selectedImage.photocardType}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-muted d-block small">Action</span>
                                    <Badge bg={selectedImage.action === 'share' ? 'info' : 'primary'} className="fs-6 text-white">
                                        {selectedImage.action === 'share' ? 'Facebook Share' : 'Download'}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="text-muted d-block small">Created At</span>
                                    <strong className="text-dark">
                                        {new Date(selectedImage.createdAt).toLocaleString('en-US')}
                                    </strong>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0 justify-content-center pb-4">
                            <a 
                                href={
                                    selectedImage.imageUrl.startsWith('http') 
                                        ? selectedImage.imageUrl 
                                        : `${STATIC_URL || 'http://localhost:5000'}/${selectedImage.imageUrl.replace(/^\/+/, '')}`
                                } 
                                download={`photocard-${selectedImage.id}.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary px-4 btn-sm fw-semibold"
                            >
                                <i className="fas fa-download me-1"></i> Download File
                            </a>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                className="fw-semibold px-3"
                                onClick={() => {
                                    const id = selectedImage.id;
                                    setSelectedImage(null);
                                    handleDeleteImage(id);
                                }}
                            >
                                <i className="fas fa-trash-alt me-1"></i> Delete
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="fw-semibold px-3" onClick={() => setSelectedImage(null)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* Custom Interactive Styles */}
            <style>{`
                .photocard-preview-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1) !important;
                }
                .photocard-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.45);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px 12px 0 0;
                }
                .photocard-preview-card:hover .photocard-overlay {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
