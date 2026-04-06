'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Spinner, Form, Card, Row, Col, Modal, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { STATIC_URL } from "@/app/lib/api";
import NextImage from 'next/image';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const IMG_URL = `${STATIC_URL}/uploads/ads`;


const AdFilters = ({ filters, onFilterChange, loading }) => {
    const handleFilterChange = (key, value) => onFilterChange({ ...filters, [key]: value });
    return (
        <Row className="mb-4">
            <Col md={3}>
                <Form.Label>Search</Form.Label>
                <Form.Control placeholder="Search..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} disabled={loading} />
            </Col>
            <Col md={2}>
                <Form.Label>Type</Form.Label>
                <Form.Select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} disabled={loading}>
                    <option value="">All Types</option>
                    <option value="image">Image</option>
                    <option value="google_adsense">Adsense</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Label>Position</Form.Label>
                <Form.Select value={filters.position} onChange={(e) => handleFilterChange('position', e.target.value)} disabled={loading}>
                    <option value="">All Positions</option>
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="in_content">In Content</option>
                    <option value="popup">Popup</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Label>Status</Form.Label>
                <Form.Select value={filters.isActive} onChange={(e) => handleFilterChange('isActive', e.target.value)} disabled={loading}>
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </Form.Select>
            </Col>
            <Col md={3} className="d-flex align-items-end">
                <Button variant="outline-secondary" className="w-100" onClick={() => onFilterChange({ search: '', type: '', position: '', isActive: '' })} disabled={loading}>Clear Filters</Button>
            </Col>
        </Row>
    );
};

const AdForm = ({ ad, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '', slug: '', type: 'image', position: 'sidebar',
        imageUrl: '', headCode: '', bodyCode: '', displayPages: '',
        startDate: '', endDate: '', isActive: true, maxImpressions: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (ad) {
            setFormData({
                name: ad.name || '', slug: ad.slug || '', type: ad.type || 'image',
                position: ad.position || 'sidebar', imageUrl: ad.imageUrl || '',
                headCode: ad.headCode || '', bodyCode: ad.bodyCode || '',
                displayPages: Array.isArray(ad.displayPages) ? ad.displayPages.join(', ') : (ad.displayPages || ''),
                startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
                endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
                isActive: ad.isActive !== undefined ? ad.isActive : true,
                maxImpressions: ad.maxImpressions || ''
            });
            if (ad.image) setImagePreview(`${IMG_URL}/${ad.image}`);
        }
    }, [ad]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value, ...(name === 'name' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }) }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                let value = formData[key];
                if (key === 'displayPages') {
                    submitData.append(key, JSON.stringify(value ? [value] : []));
                } else if (key === 'maxImpressions') {
                    submitData.append(key, value || 'null');
                } else if (value !== '' && value !== null) {
                    submitData.append(key, value);
                }
            });
            if (imageFile) submitData.append('image', imageFile);

            if (ad) {
                await api.patch(`/ads/${ad.id}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/ads', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save ad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header><h5 className="mb-0">{ad ? 'Edit Ad' : 'Create New Ad'}</h5></Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Name *</Form.Label><Form.Control name="name" value={formData.name} onChange={handleInputChange} required /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Slug *</Form.Label><Form.Control name="slug" value={formData.slug} onChange={handleInputChange} required /></Form.Group></Col>
                    </Row>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Type</Form.Label><Form.Select name="type" value={formData.type} onChange={handleInputChange}><option value="image">Image Ad</option><option value="google_adsense">Google Adsense</option></Form.Select></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Position</Form.Label><Form.Select name="position" value={formData.position} onChange={handleInputChange}><option value="header">Header</option><option value="sidebar">Sidebar</option><option value="footer">Footer</option><option value="in_content">In Content</option><option value="popup">Popup</option></Form.Select></Form.Group></Col>
                    </Row>
                    {formData.type === 'image' ? (
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Image</Form.Label><Form.Control type="file" accept="image/*" onChange={handleImageChange} /></Form.Group><Form.Group className="mb-3"><Form.Label>Click URL</Form.Label><Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} /></Form.Group></Col>
                            <Col md={6}>
                                {imagePreview && (
                                    <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                                        <NextImage src={imagePreview} alt="Preview" fill className="img-thumbnail" style={{ objectFit: 'contain' }} />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Head Code</Form.Label><Form.Control as="textarea" rows={4} name="headCode" value={formData.headCode} onChange={handleInputChange} /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Body Code</Form.Label><Form.Control as="textarea" rows={4} name="bodyCode" value={formData.bodyCode} onChange={handleInputChange} /></Form.Group></Col>
                        </Row>
                    )}
                    <Row>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Max Impressions</Form.Label><Form.Control type="number" name="maxImpressions" value={formData.maxImpressions} onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Start Date</Form.Label><Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>End Date</Form.Label><Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} /></Form.Group></Col>
                    </Row>
                    <Form.Check type="checkbox" label="Active" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="mb-3" />
                    <div className="d-flex justify-content-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Ad'}</Button></div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const AdsListClient = ({ initialAds, initialTotalCount, isAdmin }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [selectedAds, setSelectedAds] = useState([]);
    const [filters, setFilters] = useState({ search: '', type: '', position: '', isActive: '' });
    const [page, setPage] = useState(1);
    const limit = 10;

    const queryString = new URLSearchParams({
        page,
        limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
    }).toString();

    const swrKey = isAdmin ? `/ads?${queryString}` : null;
    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: page === 1 && Object.values(filters).every(v => v === '') ? { ads: initialAds, totalCount: initialTotalCount } : undefined,
        keepPreviousData: true
    });

    const ads = swrData?.ads || [];
    const totalCount = swrData?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const refreshData = () => mutate(swrKey);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ad?')) return;
        try {
            await api.delete(`/ads/${id}`);
            toast.success('Ad deleted');
            refreshData();
        } catch (error) { toast.error('Delete failed'); }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedAds.length} ads?`)) return;
        try {
            await api.post('/ads/bulk-delete', { adIds: selectedAds });
            toast.success('Ads deleted');
            setSelectedAds([]);
            refreshData();
        } catch (error) { toast.error('Bulk delete failed'); }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Ads Management</h4>
                {!showForm && <Button onClick={() => { setEditingAd(null); setShowForm(true); }}>+ Create Ad</Button>}
            </div>

            {showForm ? (
                <AdForm ad={editingAd} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refreshData(); }} />
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <AdFilters filters={filters} onFilterChange={setFilters} loading={loading} />
                        {selectedAds.length > 0 && <Button variant="danger" size="sm" className="mb-3" onClick={handleBulkDelete}>Delete Selected ({selectedAds.length})</Button>}
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{width: '40px'}}><Form.Check checked={ads.length > 0 && selectedAds.length === ads.length} onChange={(e) => setSelectedAds(e.target.checked ? ads.map(a => a.id) : [])} /></th>
                                        <th>Ad</th>
                                        <th>Type</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Stats (Imp/Clk)</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" /></td></tr> : ads.map(ad => (
                                        <tr key={ad.id}>
                                            <td><Form.Check checked={selectedAds.includes(ad.id)} onChange={(e) => setSelectedAds(prev => e.target.checked ? [...prev, ad.id] : prev.filter(id => id !== ad.id))} /></td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {ad.type === 'image' && ad.image && (
                                                        <div style={{ position: 'relative', width: '50px', height: '30px', marginRight: '0.5rem' }}>
                                                            <NextImage 
                                                                src={`${IMG_URL}/${ad.image}`} 
                                                                alt={ad.name} 
                                                                fill 
                                                                className="rounded" 
                                                                style={{ objectFit: 'cover' }}
                                                                sizes="50px"
                                                            />
                                                        </div>
                                                    )}
                                                    <div><strong>{ad.name}</strong><br /><small className="text-muted">{ad.slug}</small></div>
                                                </div>
                                            </td>
                                            <td><Badge bg={ad.type === 'image' ? 'primary' : 'success'}>{ad.type === 'image' ? 'Image' : 'Adsense'}</Badge></td>
                                            <td><Badge bg="secondary" className="text-capitalize">{ad.position}</Badge></td>
                                            <td><Badge bg={ad.isActive ? 'success' : 'danger'}>{ad.isActive ? 'Active' : 'Inactive'}</Badge></td>
                                            <td>{ad.currentImpressions || 0} / {ad.clickCount || 0}</td>
                                            <td className="text-center">
                                                <div className="btn-group">
                                                    <Button variant="outline-primary" size="sm" onClick={() => { setEditingAd(ad); setShowForm(true); }}>Edit</Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(ad.id)}>Del</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && ads.length === 0 && <tr><td colSpan="7" className="text-center py-4 text-muted">No ads found</td></tr>}
                                </tbody>
                            </Table>
                        </div>
                        {totalPages > 1 && (
                            <Pagination className="justify-content-center mt-3">
                                <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                                {[...Array(totalPages)].map((_, i) => <Pagination.Item key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>)}
                                <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                            </Pagination>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default AdsListClient;
