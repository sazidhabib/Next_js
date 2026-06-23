'use client';

import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Badge, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { STATIC_URL } from "@/app/lib/api";
import NextImage from 'next/image';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const IMG_URL = `${STATIC_URL}/uploads`;

const TagForm = ({ tag, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        tagTitle: '',
        tagDescription: '',
        image: null,
        imageUrl: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (tag) {
            setFormData({
                name: tag.name || '',
                slug: tag.slug || '',
                tagTitle: tag.tagTitle || '',
                tagDescription: tag.tagDescription || '',
                image: null,
                imageUrl: tag.image || '',
                metaTitle: tag.metaTitle || '',
                metaDescription: tag.metaDescription || '',
                metaKeywords: tag.metaKeywords || ''
            });
            if (tag.image) {
                const previewUrl = tag.image.startsWith('http') ? tag.image : `${IMG_URL}/${tag.image}`;
                setImagePreview(previewUrl);
            }
        } else {
            setFormData({
                name: '', slug: '', tagTitle: '', tagDescription: '',
                image: null, imageUrl: '', metaTitle: '', metaDescription: '', metaKeywords: ''
            });
            setImagePreview('');
        }
    }, [tag]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, [name]: file, imageUrl: '' }));
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (name === 'name' && !tag) {
                setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
            }
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setErrors({ name: 'Name is required' });
            return;
        }
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key] instanceof File) {
                submitData.append(key, formData[key]);
            } else if (key !== 'imageUrl' && key !== 'image' && formData[key]) {
                submitData.append(key, formData[key]);
            }
        });
        if (!formData.image && formData.imageUrl) {
            submitData.append('image', formData.imageUrl);
        }
        onSubmit(submitData);
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header><h5 className="mb-0">{tag ? 'Edit Tag' : 'Create New Tag'}</h5></Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Slug <span className="text-danger">*</span></Form.Label>
                                <Form.Control name="slug" value={formData.slug} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Tag Title</Form.Label>
                        <Form.Control name="tagTitle" value={formData.tagTitle} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tag Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="tagDescription" value={formData.tagDescription} onChange={handleChange} />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Or Image URL</Form.Label>
                                <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    {imagePreview && (
                        <div className="mb-3">
                            <div style={{ position: 'relative', height: '100px', width: '150px' }}>
                                <NextImage src={imagePreview} alt="Preview" fill className="img-thumbnail" style={{ objectFit: 'contain' }} />
                            </div>
                        </div>
                    )}
                    <Card className="mt-3 bg-light border-0">
                        <Card.Header className="bg-light border-0"><h6 className="mb-0">SEO Settings</h6></Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-2">
                                <Form.Label>Meta Title</Form.Label>
                                <Form.Control name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Meta Description</Form.Label>
                                <Form.Control as="textarea" rows={2} name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-0">
                                <Form.Label>Meta Keywords</Form.Label>
                                <Form.Control name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="k1, k2" />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className="mt-4 d-flex gap-2">
                        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (tag ? 'Update Tag' : 'Create Tag')}</Button>
                        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const TagsListClient = ({ initialTags, isAdmin }) => {
    const [editingTag, setEditingTag] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const swrKey = isAdmin ? '/tags' : null;
    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: initialTags,
        keepPreviousData: true
    });

    const tags = Array.isArray(swrData) ? swrData : (swrData?.tags || swrData?.data || []);

    const refreshData = () => mutate(swrKey);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (editingTag) {
                await api.patch(`/tags/${editingTag.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Tag updated');
            } else {
                await api.post('/tags', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Tag created');
            }
            refreshData();
            setShowForm(false);
            setEditingTag(null);
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (tagId) => {
        if (window.confirm('Delete this tag?')) {
            try {
                await api.delete(`/tags/${tagId}`);
                toast.success('Tag deleted');
                refreshData();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Tags Dashboard</h4>
                <Button onClick={() => setShowForm(true)} disabled={showForm}>+ Add Tag</Button>
            </div>

            {showForm && (
                <TagForm
                    tag={editingTag}
                    onSubmit={handleSubmit}
                    onCancel={() => { setShowForm(false); setEditingTag(null); }}
                    isSubmitting={isSubmitting}
                />
            )}

            {loading && !showForm ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Image</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.map((tag, index) => (
                                    <tr key={tag.id || index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {tag.image && (
                                                    <div style={{ position: 'relative', width: '30px', height: '30px', marginRight: '0.5rem' }}>
                                                        <NextImage 
                                                            src={tag.image.startsWith('http') ? tag.image : `${IMG_URL}/${tag.image}`} 
                                                            alt="" 
                                                            fill 
                                                            className="rounded" 
                                                            style={{ objectFit: 'cover' }}
                                                            sizes="30px"
                                                        />
                                                    </div>
                                                )}
                                                {tag.name}
                                            </div>
                                        </td>
                                        <td><code>{tag.slug}</code></td>
                                        <td>{tag.image ? <Badge bg="success">Yes</Badge> : <Badge bg="secondary">No</Badge>}</td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <Button variant="outline-primary" size="sm" onClick={() => { setEditingTag(tag); setShowForm(true); }}>Edit</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(tag.id)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tags.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-muted">No tags found.</td></tr>}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default TagsListClient;
