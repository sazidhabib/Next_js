'use client';

import React, { useState } from 'react';
import { Table, Form, Button, Card, Spinner, Pagination, Modal, Badge, Row, Col, Image as BSImage } from 'react-bootstrap';
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
    const [sourceFilter, setSourceFilter] = useState("");

    const [formData, setFormData] = useState({ albumId: '', status: 'active', caption: '', images: null });
    const [previews, setPreviews] = useState([]);

    const swrKey = isAdmin ? `/all/images?page=${page}&limit=20&sourceType=${sourceFilter}` : null;
    
    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: page === 1 && sourceFilter === "" ? { 
            images: initialImages, 
            pagination: { totalPages: initialTotalPages, totalCount: initialTotalCount } 
        } : undefined,
        keepPreviousData: true
    });

    const images = swrData?.images || [];
    const totalPages = swrData?.pagination?.totalPages || 1;
    const totalCount = swrData?.pagination?.totalCount || 0;

    const refreshData = () => mutate(swrKey);

    const handleShowModal = (photo = null) => {
        if (photo) {
            setEditPhoto(photo);
            setFormData({ albumId: photo.album?.id || '', status: photo.status || 'active', caption: photo.caption || '', images: null });
            setPreviews(photo.imageUrl ? [`${IMG_URL}/${photo.imageUrl}`] : []);
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

    const getImageUrl = (url) => url ? `${IMG_URL}/${url.startsWith('/') ? url.substring(1) : url}` : '';

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4>Image Management</h4>
                    <small className="text-muted">Total: {totalCount} images</small>
                </div>
                <Button onClick={() => handleShowModal()}>+ Upload Photo</Button>
            </div>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}>
                        <option value="">All Sources</option>
                        <option value="article">Articles</option>
                        <option value="blog">Blogs</option>
                        <option value="news">News</option>
                        <option value="photo">Photo Gallery</option>
                        <option value="other">Other</option>
                    </Form.Select>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
                        <Table responsive hover className="mb-0">
                            <thead className="table-dark">
                                <tr><th>Preview</th><th>Filename</th><th>Source</th><th>Uploaded</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {images.map(img => (
                                    <tr key={img.id}>
                                        <td>
                                            <div style={{ position: 'relative', width: '80px', height: '60px' }}>
                                                <NextImage 
                                                    src={getImageUrl(img.imageUrl)} 
                                                    alt={img.filename}
                                                    fill
                                                    className="rounded thumbnail-img"
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="80px"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-truncate fw-bold" style={{maxWidth: '150px'}}>{img.filename}</div>
                                            <small className="text-muted text-truncate d-block" style={{maxWidth: '150px'}}>{img.imageUrl}</small>
                                        </td>
                                        <td><Badge bg={img.source === 'photo' ? 'primary' : 'secondary'}>{img.source}</Badge></td>
                                        <td>{new Date(img.createdAt).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                {img.source === 'other' ? <Button variant="outline-success" size="sm" onClick={() => handleConvertToPhoto(img)}>To Gallery</Button> : 
                                                 img.source === 'photo' ? <Button variant="outline-warning" size="sm" onClick={() => handleShowModal(img)}>Edit</Button> : null}
                                                <Button variant="outline-danger" size="sm" onClick={() => { setImageToDelete(img); setShowConfirm(true); }}>Del</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {images.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-muted">No images found</td></tr>}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
            
            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                    <Pagination.Item active>{page}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
                </Pagination>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>{editPhoto ? 'Edit' : 'Upload'} Photo</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Album</Form.Label>
                            <Form.Select value={formData.albumId} onChange={e => setFormData({ ...formData, albumId: e.target.value })} required>
                                <option value="">Select Album</option>
                                {albums.map(a => <option key={a.id || a._id} value={a.id || a._id}>{a.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" multiple onChange={handleFileChange} />
                        </Form.Group>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {previews.map((p, i) => (
                                <div key={i} style={{ position: 'relative', width: '80px', height: '60px' }}>
                                    <NextImage src={p} alt="preview" fill style={{ objectFit: 'cover' }} className="rounded" />
                                </div>
                            ))}
                        </div>
                        <Form.Group className="mb-3"><Form.Label>Caption</Form.Label><Form.Control value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton><Modal.Title>Delete Image</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Delete this image from the registry?</p>
                    <Form.Check type="checkbox" label="Also delete from filesystem" checked={deleteFromFS} onChange={e => setDeleteFromFS(e.target.checked)} />
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></Modal.Footer>
            </Modal>
        </div>
    );
};

export default PhotosListClient;
