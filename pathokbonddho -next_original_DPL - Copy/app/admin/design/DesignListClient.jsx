'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from "@/app/lib/api";

const DesignListClient = ({ initialDesigns, isAdmin }) => {
    const [designs, setDesigns] = useState(initialDesigns || []);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingDesign, setEditingDesign] = useState(null);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [formData, setFormData] = useState({
        design_name: '',
        slug: '',
        design_status: true,
        description: '',
        design_data: '{}'
    });

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const params = { search: searchTerm, design_status: statusFilter };
            const response = await api.get('/designs', { params });
            const data = response.data.designs || response.data || [];
            setDesigns(Array.isArray(data) ? data : []);
        } catch (error) { toast.error('Failed to fetch designs'); }
        finally { setLoading(false); }
    };

    // Trigger fetch on filters
    const isFirstRun = React.useRef(true);
    useEffect(() => {
        if (isFirstRun.current) { isFirstRun.current = false; return; }
        fetchDesigns();
    }, [searchTerm, statusFilter]);

    const handleShowModal = (design = null) => {
        if (design) {
            setEditingDesign(design);
            setFormData({
                design_name: design.design_name,
                slug: design.slug,
                design_status: design.design_status,
                description: design.description || '',
                design_data: typeof design.design_data === 'string'
                    ? design.design_data
                    : JSON.stringify(design.design_data, null, 2)
            });
        } else {
            setFormData({ design_name: '', slug: '', design_status: true, description: '', design_data: '{}' });
            setEditingDesign(null);
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'design_name') {
                newState.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let designDataJson;
        try { designDataJson = formData.design_data.trim() ? JSON.parse(formData.design_data) : {}; }
        catch (error) { toast.error('Check JSON format'); return; }

        try {
            const submitData = { ...formData, design_data: designDataJson };
            if (editingDesign) {
                await api.patch(`/designs/${editingDesign.id}`, submitData);
                toast.success('Design updated');
            } else {
                await api.post('/designs', submitData);
                toast.success('Design created');
            }
            setShowModal(false);
            fetchDesigns();
        } catch (error) { toast.error('Failed to save'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete design?')) return;
        try { await api.delete(`/designs/${id}`); fetchDesigns(); } catch (err) { toast.error('Delete failed'); }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">🎨 Design Configurations</h4>
                <Button variant="primary" onClick={() => handleShowModal()} className="shadow-sm">
                    <i className="fas fa-magic me-2"></i>New Configuration
                </Button>
            </div>

            <Card className="mb-4 shadow-sm border-0 bg-light">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={7}>
                            <Form.Control placeholder="Search by name or slug..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0 shadow-sm" />
                        </Col>
                        <Col md={3}>
                            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border-0 shadow-sm">
                                <option value="">Visibility: All</option>
                                <option value="true">Active Only</option>
                                <option value="false">Inactive Only</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} className="text-end">
                             {selectedDesigns.length > 0 && <Button variant="danger" size="sm">Delete ({selectedDesigns.length})</Button>}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th style={{width: 50}}><Form.Check checked={designs.length > 0 && selectedDesigns.length === designs.length} onChange={(e) => setSelectedDesigns(e.target.checked ? designs.map(d => d.id) : [])} /></th>
                                <th>Identity</th>
                                <th>Slug / Identifier</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr> : designs.map(design => (
                                <tr key={design.id} className="align-middle">
                                    <td><Form.Check checked={selectedDesigns.includes(design.id)} onChange={(e) => setSelectedDesigns(prev => e.target.checked ? [...prev, design.id] : prev.filter(id => id !== design.id))} /></td>
                                    <td>
                                        <div className="fw-bold">{design.design_name}</div>
                                        <div className="text-muted small text-truncate" style={{maxWidth: '300px'}}>{design.description || 'No description provided'}</div>
                                    </td>
                                    <td><code className="text-primary">{design.slug}</code></td>
                                    <td><Badge bg={design.design_status ? 'success' : 'secondary'}>{design.design_status ? 'Active' : 'Inactive'}</Badge></td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(design)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(design.id)}>Del</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && designs.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">No design documents found.</td></tr>}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">{editingDesign ? 'Modify' : 'Initialize'} Design</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="bg-light">
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label className="fw-bold">Display Name *</Form.Label><Form.Control name="design_name" value={formData.design_name} onChange={handleInputChange} required placeholder="e.g. Header Settings" /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label className="fw-bold">System Slug *</Form.Label><Form.Control name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="header-settings" /></Form.Group></Col>
                        </Row>
                        <Form.Group className="mb-3"><Form.Label className="fw-bold">Internal Description</Form.Label><Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleInputChange} placeholder="What does this design config control?" /></Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Payload Data (JSON Schema)</Form.Label>
                            <Form.Control as="textarea" rows={10} name="design_data" value={formData.design_data} onChange={handleInputChange} style={{ fontFamily: '"Fira Code", monospace', fontSize: '13px' }} placeholder="{}" />
                        </Form.Group>
                        <Form.Check type="switch" id="design-status" label="Enable Configuration" name="design_status" checked={formData.design_status} onChange={handleInputChange} className="mb-2 fw-bold" />
                    </Modal.Body>
                    <Modal.Footer className="border-top-0 pt-0">
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="px-5">Save Configuration</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default DesignListClient;
