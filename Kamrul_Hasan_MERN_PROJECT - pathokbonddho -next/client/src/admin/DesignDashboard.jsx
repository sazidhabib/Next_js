import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../store/auth';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/designs` || '';

const DesignDashboard = () => {
    const { token, isAdmin } = useAuth();
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingDesign, setEditingDesign] = useState(null);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        design_name: '',
        slug: '',
        design_status: true,
        description: '',
        design_data: '{}'
    });

    // Fetch designs with better debugging
    // Temporary debug version of fetchDesigns
    const fetchDesigns = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching designs from:', `${API_URL}?search=${searchTerm}&design_status=${statusFilter}`);
            console.log('📝 Token available:', !!token);

            // First, try the debug endpoint to see all data
            const debugResponse = await axios.get(`${API_URL}/debug/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('🐛 DEBUG API Response:', debugResponse.data);

            // Then try the normal endpoint
            const response = await axios.get(`${API_URL}?search=${searchTerm}&design_status=${statusFilter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ NORMAL API Response:', response.data);

            const designsData = response.data.designs || response.data || [];
            setDesigns(Array.isArray(designsData) ? designsData : []);

        } catch (error) {
            console.error('❌ Error fetching designs:', error);
            // If debug endpoint fails, try normal endpoint
            try {
                const response = await axios.get(`${API_URL}?search=${searchTerm}&design_status=${statusFilter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('✅ Fallback API Response:', response.data);
                const designsData = response.data.designs || response.data || [];
                setDesigns(Array.isArray(designsData) ? designsData : []);
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                toast.error('Failed to fetch designs');
                setDesigns([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('🏗️ DesignDashboard mounted, isAdmin:', isAdmin);
        if (isAdmin && token) {
            fetchDesigns();
        }
    }, [isAdmin, searchTerm, statusFilter]);

    // Add useEffect to debug designs state changes
    useEffect(() => {
        console.log('🔄 Designs state updated:', designs);
    }, [designs]);

    // Reset form
    const resetForm = () => {
        setFormData({
            design_name: '',
            slug: '',
            design_status: true,
            description: '',
            design_data: '{}'
        });
        setEditingDesign(null);
    };

    // Handle modal show/hide
    const handleShowModal = (design = null) => {
        console.log('📝 Opening modal for design:', design);
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
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Generate slug from design name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // Handle design name change (auto-generate slug)
    const handleDesignNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            design_name: name,
            slug: generateSlug(name)
        }));
    };

    // Validate form
    const validateForm = () => {
        if (!formData.design_name.trim()) {
            toast.error('Design name is required');
            return false;
        }
        if (!formData.slug.trim()) {
            toast.error('Slug is required');
            return false;
        }

        // Validate JSON if design_data is provided
        if (formData.design_data.trim()) {
            try {
                JSON.parse(formData.design_data);
            } catch (error) {
                toast.error('Design data must be valid JSON');
                return false;
            }
        }

        return true;
    };

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const submitData = {
                ...formData,
                design_data: formData.design_data.trim() ? JSON.parse(formData.design_data) : {}
            };

            console.log('🚀 Submitting design data:', submitData);

            if (editingDesign) {
                // Update existing design
                await axios.patch(`${API_URL}/${editingDesign.id}`, submitData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Design updated successfully');
            } else {
                // Create new design
                await axios.post(API_URL, submitData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Design created successfully');
            }

            handleCloseModal();
            fetchDesigns();
        } catch (error) {
            console.error('❌ Error saving design:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save design';
            toast.error(errorMessage);
        }
    };

    // Delete design
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this design?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Design deleted successfully');
            fetchDesigns();
        } catch (error) {
            console.error('Error deleting design:', error);
            toast.error('Failed to delete design');
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (selectedDesigns.length === 0) {
            toast.warning('Please select designs to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedDesigns.length} design(s)?`)) {
            return;
        }

        try {
            await axios.post(`${API_URL}/bulk-delete`,
                { designIds: selectedDesigns },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${selectedDesigns.length} design(s) deleted successfully`);
            setSelectedDesigns([]);
            fetchDesigns();
        } catch (error) {
            console.error('Error bulk deleting designs:', error);
            toast.error('Failed to delete designs');
        }
    };

    // Toggle design status
    const toggleStatus = async (design) => {
        try {
            await axios.patch(`${API_URL}/${design.id}`,
                { design_status: !design.design_status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Design ${!design.design_status ? 'activated' : 'deactivated'}`);
            fetchDesigns();
        } catch (error) {
            console.error('Error updating design status:', error);
            toast.error('Failed to update design status');
        }
    };

    // Handle select/deselect all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedDesigns(designs.map(design => design.id));
        } else {
            setSelectedDesigns([]);
        }
    };

    // Handle individual selection
    const handleSelectDesign = (id, checked) => {
        if (checked) {
            setSelectedDesigns(prev => [...prev, id]);
        } else {
            setSelectedDesigns(prev => prev.filter(designId => designId !== id));
        }
    };

    // Format design data for display
    const formatDesignData = (designData) => {
        if (!designData) return 'No data';
        try {
            const data = typeof designData === 'string' ? JSON.parse(designData) : designData;
            return Object.keys(data).length > 0 ? `${Object.keys(data).length} properties` : 'Empty';
        } catch {
            return 'Invalid JSON';
        }
    };

    // Test API connection
    const testApiConnection = async () => {
        try {
            console.log('🧪 Testing API connection to:', API_URL);
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ API Connection test successful:', response.data);
            toast.success('API connection successful!');
        } catch (error) {
            console.error('❌ API Connection test failed:', error);
            toast.error('API connection failed!');
        }
    };

    if (!isAdmin) {
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Body className="text-center">
                        <h4>Access Denied</h4>
                        <p>You need admin privileges to access this page.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4 custom-font-initial">
            {/* Debug Header */}
            <Row className="mb-2">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Designs in state: {designs.length} |
                            Loading: {loading.toString()} |
                            Admin: {isAdmin.toString()}
                        </small>
                        <Button variant="outline-secondary" size="sm" onClick={testApiConnection}>
                            Test API
                        </Button>
                        <Button variant="outline-info" size="sm" onClick={fetchDesigns} className="ms-2">
                            Refresh
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Design Management</h2>
                            <p className="text-muted">Manage your page layout designs</p>
                        </div>
                        <Button variant="primary" onClick={() => handleShowModal()}>
                            <i className="fa fa-plus me-2"></i>
                            Add New Design
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Filters and Bulk Actions */}
            <Row className="mb-3">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search designs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    {selectedDesigns.length > 0 && (
                        <Button variant="danger" onClick={handleBulkDelete}>
                            <i className="fas fa-trash me-2"></i>
                            Delete Selected ({selectedDesigns.length})
                        </Button>
                    )}
                </Col>
            </Row>

            {/* Designs Table */}
            <Card>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="mt-2">Loading designs...</div>
                        </div>
                    ) : designs.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">No designs found</p>
                            <p className="text-muted small mb-3">
                                Check console for API response details
                            </p>
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                Create Your First Design
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedDesigns.length === designs.length && designs.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Design Name</th>
                                        <th>Slug</th>
                                        <th>Design Data</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {designs.map((design) => (
                                        <tr key={design.id}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedDesigns.includes(design.id)}
                                                    onChange={(e) => handleSelectDesign(design.id, e.target.checked)}
                                                />
                                            </td>
                                            <td>
                                                <strong>{design.design_name}</strong>
                                                {design.description && (
                                                    <div className="text-muted small">{design.description}</div>
                                                )}
                                            </td>
                                            <td>
                                                <code>{design.slug}</code>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {formatDesignData(design.design_data)}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg={design.design_status ? 'success' : 'secondary'}>
                                                    {design.design_status ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {new Date(design.createdAt).toLocaleDateString()}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleShowModal(design)}
                                                    >
                                                        <i className="fas fa-pencil"></i>
                                                    </Button>
                                                    <Button
                                                        variant={design.design_status ? "outline-warning" : "outline-success"}
                                                        size="sm"
                                                        onClick={() => toggleStatus(design)}
                                                    >
                                                        <i className={`fas fa-${design.design_status ? 'pause' : 'play'}`}></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(design.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" className='custom-font-initial'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingDesign ? 'Edit Design' : 'Create New Design'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Design Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="design_name"
                                        value={formData.design_name}
                                        onChange={handleDesignNameChange}
                                        placeholder="Enter design name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Slug *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="design-slug"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Unique identifier for this design
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of this design"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Design Data (JSON)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="design_data"
                                value={formData.design_data}
                                onChange={handleInputChange}
                                placeholder='{"colors": {"primary": "#3498db"}, "layout": "modern"}'
                                style={{ fontFamily: 'monospace' }}
                            />
                            <Form.Text className="text-muted">
                                Enter design configuration as JSON. This will be used in the frontend.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="design_status"
                                label="Active Design"
                                checked={formData.design_status}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingDesign ? 'Update Design' : 'Create Design'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default DesignDashboard;