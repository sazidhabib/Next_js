'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Spinner, Form, Card, Row, Col, Modal, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { STATIC_URL } from "@/app/lib/api";
import NextImage from 'next/image';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const IMG_URL = `${STATIC_URL}/uploads`;

const getFullImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith('http')) return imgPath;
    const cleanPath = imgPath.replace(/^\/+/, "");
    // Backend saves author images in uploads/authors/ directory
    // DB stores just the filename (e.g. "image-123.webp")
    if (cleanPath.startsWith('uploads/')) {
        return `${STATIC_URL}/${cleanPath}`;
    }
    // If path has a subdirectory like "authors/file.webp"
    if (cleanPath.includes('/')) {
        return `${STATIC_URL}/uploads/${cleanPath}`;
    }
    // Just a filename — prepend the authors subdirectory
    return `${STATIC_URL}/uploads/authors/${cleanPath}`;
};

const AuthorsListClient = ({ initialAuthors, initialPagination, isAdmin }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecial, setFilterSpecial] = useState('');
    const [page, setPage] = useState(initialPagination?.currentPage || 1);

    const [formData, setFormData] = useState({ name: '', description: '', websiteLink: '', isSpecialAuthor: false });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const swrKey = isAdmin ? `/authors?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}${filterSpecial ? `&isSpecialAuthor=${filterSpecial}` : ''}` : null;

    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: page === 1 && !searchTerm && !filterSpecial ? {
            authors: initialAuthors,
            ...initialPagination
        } : undefined,
        keepPreviousData: true
    });

    const authors = swrData?.authors || swrData?.data || [];
    const pagination = {
        currentPage: swrData?.currentPage || page,
        totalPages: swrData?.totalPages || 1,
        totalCount: swrData?.totalCount || 0,
        hasNext: swrData?.hasNext || false,
        hasPrev: swrData?.hasPrev || false
    };

    const refreshData = () => mutate(swrKey);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', websiteLink: '', isSpecialAuthor: false });
        setImageFile(null);
        setImagePreview('');
        setEditingAuthor(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        if (imageFile) submitData.append('image', imageFile);

        // Debug: log what we're sending
        console.log('=== AUTHOR SUBMIT DEBUG ===');
        for (let [key, value] of submitData.entries()) {
            console.log(key, ':', value instanceof File ? `File(${value.name}, ${value.size}bytes)` : value);
        }

        try {
            if (editingAuthor) {
                // Do NOT set Content-Type manually for FormData — browser must set it with boundary
                await api.patch(`/authors/${editingAuthor.id}`, submitData);
                toast.success('Author updated');
            } else {
                await api.post('/authors', submitData);
                toast.success('Author created');
            }
            setShowModal(false);
            resetForm();
            refreshData();
        } catch (error) { 
            console.error('Author submit error:', error);
            toast.error(error.response?.data?.message || 'Operation failed'); 
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this author?')) return;
        try {
            await api.delete(`/authors/${id}`);
            toast.success('Author deleted');
            refreshData();
        } catch (error) { toast.error('Delete failed'); }
    };

    const toggleSelectAll = () => setSelectedAuthors(selectedAuthors.length === authors.length ? [] : authors.map(a => a.id));

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">✍️ Authors Management</h4>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }} className="shadow-sm">
                    <i className="fas fa-plus me-2"></i>Add Author
                </Button>
            </div>

            <Card className="mb-4 shadow-sm border-0 bg-light">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={5}>
                            <Form.Control placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0 shadow-sm" />
                        </Col>
                        <Col md={3}>
                            <Form.Select value={filterSpecial} onChange={(e) => setFilterSpecial(e.target.value)} className="border-0 shadow-sm">
                                <option value="">All Types</option>
                                <option value="true">Special Authors</option>
                                <option value="false">Regular Authors</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="text-end">
                            {selectedAuthors.length > 0 && <Button variant="danger" className="shadow-sm" onClick={() => {/* bulk delete logic if exists */ }}>Delete Selected ({selectedAuthors.length})</Button>}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: 50 }}><Form.Check checked={authors.length > 0 && selectedAuthors.length === authors.length} onChange={toggleSelectAll} /></th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr> : authors.map(author => (
                                <tr key={author.id} className="align-middle">
                                    <td><Form.Check checked={selectedAuthors.includes(author.id)} onChange={() => setSelectedAuthors(prev => prev.includes(author.id) ? prev.filter(aid => aid !== author.id) : [...prev, author.id])} /></td>
                                    <td>
                                        {author.image ? (
                                            <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                                <NextImage
                                                    src={getFullImageUrl(author.image)}
                                                    alt={author.name}
                                                    fill
                                                    className="rounded-circle shadow-sm"
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="40px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}><i className="fas fa-user"></i></div>
                                        )}
                                    </td>
                                    <td className="fw-bold">{author.name}</td>
                                    <td><Badge bg={author.isSpecialAuthor ? "success" : "info"}>{author.isSpecialAuthor ? 'Special' : 'Regular'}</Badge></td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            <Button variant="outline-primary" size="sm" onClick={() => {
                                                setEditingAuthor(author);
                                                setFormData({ name: author.name, description: author.description || '', websiteLink: author.websiteLink || '', isSpecialAuthor: author.isSpecialAuthor });
                                                setImagePreview(getFullImageUrl(author.image));
                                                setShowModal(true);
                                            }}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(author.id)}>Del</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>

            {pagination.totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev disabled={!pagination.hasPrev} onClick={() => setPage(pagination.currentPage - 1)} />
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <Pagination.Item key={i} active={i + 1 === pagination.currentPage} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                    <Pagination.Next disabled={!pagination.hasNext} onClick={() => setPage(pagination.currentPage + 1)} />
                </Pagination>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">{editingAuthor ? 'Edit' : 'Add'} Author Profile</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="bg-light">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Full Name *</Form.Label>
                                    <Form.Control name="name" value={formData.name} onChange={handleInputChange} required placeholder="Author's name" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Website / Social URL</Form.Label>
                                    <Form.Control name="websiteLink" value={formData.websiteLink} onChange={handleInputChange} placeholder="https://..." />
                                </Form.Group>
                                <Form.Check type="switch" label="Make Special Author" id="special-switch" name="isSpecialAuthor" checked={formData.isSpecialAuthor} onChange={handleInputChange} className="mb-3 fw-bold" />
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Profile Photo</Form.Label>
                                    <Form.Control type="file" onChange={handleImageChange} className="border-0 shadow-sm" />
                                </Form.Group>
                                {imagePreview && (
                                    <div className="text-center mt-2 border rounded p-2 bg-white">
                                        <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                                            <NextImage src={imagePreview} alt="Preview" fill className="img-thumbnail border-0" style={{ objectFit: 'contain' }} />
                                        </div>
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Biography / Description</Form.Label>
                                    <Form.Control as="textarea" rows={9} name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief bio..." />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-top-0 pt-0">
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>Discard</Button>
                        <Button type="submit" variant="primary" className="px-5" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                            {editingAuthor ? 'Update Profile' : 'Save Profile'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default AuthorsListClient;
