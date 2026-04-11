import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Container, Row, Col, Card, Button, Form, Modal, Alert,
    Tab, Nav, Spinner, Badge
} from 'react-bootstrap';

// Sortable Section Component
// Sortable Section Component
const SortableSection = ({ section, sectionIndex, onDelete, onUpdate, onAddColumn, editPage, setEditPage }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id || `section-${sectionIndex}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Safe access to rows and columns
    const rows = section.rows || [];
    const firstRow = rows[0] || { columns: [] };
    const columns = firstRow.columns || [];

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="mb-3"
        >
            <Card.Header {...attributes} {...listeners} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <span>Section {sectionIndex + 1} 🟰 (Drag here)</span>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(sectionIndex)}
                    >
                        Delete
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Layout Type</Form.Label>
                    <Form.Select
                        value={section.layoutType || 'grid'}
                        onChange={(e) => {
                            onUpdate(sectionIndex, 'layoutType', e.target.value);
                        }}
                    >
                        <option value="grid">Grid</option>
                        <option value="flex">Flex</option>
                    </Form.Select>
                </Form.Group>

                {/* Columns editing */}
                {columns.map((column, colIndex) => (
                    <Row key={colIndex} className="mb-2">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Content Type</Form.Label>
                                <Form.Select
                                    value={column.contentType || 'text'}
                                    onChange={(e) => {
                                        const updatedSections = [...editPage.PageSections];
                                        if (updatedSections[sectionIndex]?.rows[0]?.columns[colIndex]) {
                                            updatedSections[sectionIndex].rows[0].columns[colIndex].contentType = e.target.value;
                                            setEditPage({ ...editPage, PageSections: updatedSections });
                                        }
                                    }}
                                >
                                    <option value="text">Text</option>
                                    <option value="news">News</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Width</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={column.width || 12}
                                    onChange={(e) => {
                                        const updatedSections = [...editPage.PageSections];
                                        if (updatedSections[sectionIndex]?.rows[0]?.columns[colIndex]) {
                                            updatedSections[sectionIndex].rows[0].columns[colIndex].width = parseInt(e.target.value) || 12;
                                            setEditPage({ ...editPage, PageSections: updatedSections });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Tag</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={column.tag || ''}
                                    onChange={(e) => {
                                        const updatedSections = [...editPage.PageSections];
                                        if (updatedSections[sectionIndex]?.rows[0]?.columns[colIndex]) {
                                            updatedSections[sectionIndex].rows[0].columns[colIndex].tag = e.target.value;
                                            setEditPage({ ...editPage, PageSections: updatedSections });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                    const updatedSections = [...editPage.PageSections];

                                    // Safe deletion with null checks
                                    if (updatedSections[sectionIndex]?.rows?.[0]?.columns) {
                                        updatedSections[sectionIndex].rows[0].columns =
                                            updatedSections[sectionIndex].rows[0].columns.filter((_, colIdx) => colIdx !== colIndex);

                                        // Reorder the remaining columns
                                        updatedSections[sectionIndex].rows[0].columns =
                                            updatedSections[sectionIndex].rows[0].columns.map((col, newIndex) => ({
                                                ...col,
                                                colOrder: newIndex + 1
                                            }));

                                        setEditPage({ ...editPage, PageSections: updatedSections });
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                ))}

                <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onAddColumn(sectionIndex)}
                >
                    + Add Column
                </Button>
            </Card.Body>
        </Card>
    );
};
import axios from 'axios';
import { useAuth } from '../store/auth'; // Import your AuthContext

const PageLayoutDashboard = () => {
    const { token, isLoggedIn, LogoutUser } = useAuth();
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [newPage, setNewPage] = useState({
        name: '',
        sections: [{
            layoutType: 'grid',
            rows: [{
                rowOrder: 1,
                columns: [{
                    colOrder: 1,
                    width: 12,
                    contentType: 'text',
                    tag: 'main-content'
                }]
            }]
        }]
    });

    const [editPage, setEditPage] = useState(null);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    // Create axios instance with base config
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Add request interceptor to include token
    api.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                LogoutUser();
            }
            return Promise.reject(error);
        }
    );

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    // Fetch all pages with axios
    const fetchPages = async () => {
        try {
            setLoading(true);
            const response = await api.get('/layout');
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
            if (error.response?.status !== 401) { // Don't show alert for 401 (handled by interceptor)
                showAlert(error.response?.data?.message || 'Error loading pages', 'danger');
            }
            setPages([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch specific page layout
    const fetchPageLayout = async (pageId) => {
        try {
            const response = await api.get(`/layout/${pageId}`);
            setSelectedPage(response.data);
        } catch (error) {
            console.error('Error fetching page layout:', error);
            if (error.response?.status !== 401) {
                showAlert(error.response?.data?.message || 'Error fetching page layout', 'danger');
            }
        }
    };

    // Create new page
    const createPage = async () => {
        try {
            const response = await api.post('/layout', newPage);
            showAlert('Page created successfully!', 'success');
            setShowCreateModal(false);
            setNewPage({
                name: '',
                sections: [{
                    layoutType: 'grid',
                    rows: [{
                        rowOrder: 1,
                        columns: [{
                            colOrder: 1,
                            width: 12,
                            contentType: 'text',
                            tag: 'main-content'
                        }]
                    }]
                }]
            });
            fetchPages();
        } catch (error) {
            console.error('Error creating page:', error);
            showAlert(error.response?.data?.message || 'Error creating page', 'danger');
        }
    };


    // Fetch page layout for editing
    const fetchPageForEdit = async (pageId) => {
        try {
            const response = await api.get(`/layout/${pageId}`);
            const pageData = response.data;

            console.log('Page data for editing:', pageData);

            // Normalize the data structure - handle both 'Rows' and 'rows', 'Columns' and 'columns'
            if (pageData.PageSections) {
                pageData.PageSections = pageData.PageSections.map((section, index) => {
                    // Use Rows if available, otherwise use rows, otherwise create default
                    const rows = section.Rows || section.rows || [];

                    return {
                        ...section,
                        id: section.id || `section-${index}`,
                        rows: rows.map(row => ({
                            ...row,
                            // Use Columns if available, otherwise use columns
                            columns: row.Columns || row.columns || []
                        }))
                    };
                });
            }

            console.log('Normalized page data:', pageData);
            setEditPage(pageData);
            setShowEditModal(true);
        } catch (error) {
            console.error('Error fetching page for edit:', error);
            showAlert('Error loading page for editing', 'danger');
        }
    };


    // Update page
    // Update page function in frontend
    const updatePage = async () => {
        try {
            // Prepare data in the correct structure for backend
            const updateData = {
                name: editPage.name,
                PageSections: editPage.PageSections.map((section, sectionIndex) => {
                    console.log('Processing section:', section);

                    // Ensure section has proper structure
                    const processedSection = {
                        layoutType: section.layoutType || 'grid',
                        rows: []
                    };

                    // Handle both 'rows' and 'Rows' for compatibility
                    const rows = section.rows || section.Rows || [];

                    if (rows.length > 0) {
                        processedSection.rows = rows.map((row, rowIndex) => ({
                            rowOrder: row.rowOrder || sectionIndex + 1,
                            columns: (row.columns || row.Columns || []).map((column, colIndex) => ({
                                colOrder: column.colOrder || colIndex + 1,
                                width: column.width || 12,
                                contentType: column.contentType || 'text',
                                tag: column.tag || `col-${colIndex + 1}`
                            }))
                        }));
                    } else {
                        // If no rows, create a default one
                        processedSection.rows = [{
                            rowOrder: 1,
                            columns: [{
                                colOrder: 1,
                                width: 12,
                                contentType: 'text',
                                tag: 'main-content'
                            }]
                        }];
                    }

                    return processedSection;
                })
            };

            console.log('Sending update data:', JSON.stringify(updateData, null, 2));

            const response = await api.patch(`/layout/${editPage.id}`, updateData);

            console.log('Update response:', response.data);
            console.log('Sections in response:', response.data.PageSections?.length);

            showAlert('Page updated successfully!', 'success');
            setShowEditModal(false);
            setEditPage(null);

            // Refresh data
            setTimeout(() => {
                fetchPages();
                if (selectedPage?.id === editPage.id) {
                    fetchPageLayout(editPage.id);
                }
            }, 1000);

        } catch (error) {
            console.error('Error updating page:', error);
            showAlert(error.response?.data?.message || 'Error updating page', 'danger');
        }
    };

    // Drag and drop handler for sections
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || !editPage) return;

        if (active.id !== over.id) {
            const oldIndex = editPage.PageSections.findIndex(section =>
                section.id === active.id
            );
            const newIndex = editPage.PageSections.findIndex(section =>
                section.id === over.id
            );

            const reorderedSections = arrayMove(editPage.PageSections, oldIndex, newIndex);

            // Update order numbers
            reorderedSections.forEach((section, index) => {
                section.rows.forEach(row => {
                    row.rowOrder = index + 1;
                });
            });

            setEditPage({
                ...editPage,
                PageSections: reorderedSections
            });
        }
    };

    // Create Modal functions
    const addCreateSection = () => {
        const newSection = {
            layoutType: 'grid',
            rows: [{
                rowOrder: newPage.sections.length + 1,
                columns: [{
                    colOrder: 1,
                    width: 12,
                    contentType: 'text',
                    tag: `section-${newPage.sections.length + 1}`
                }]
            }]
        };

        setNewPage({
            ...newPage,
            sections: [...newPage.sections, newSection]
        });
    };

    const addCreateColumn = (sectionIndex, rowIndex = 0) => {
        const updatedSections = [...newPage.sections];
        const section = updatedSections[sectionIndex];
        const row = section.rows[rowIndex];

        row.columns.push({
            colOrder: row.columns.length + 1,
            width: 6,
            contentType: 'text',
            tag: `column-${row.columns.length + 1}`
        });

        setNewPage({
            ...newPage,
            sections: updatedSections
        });
    };
    // Edit Modal functions - add "Edit" prefix
    const addEditSection = () => {
        if (!editPage) return;

        const newSection = {
            id: `section-${Date.now()}`,
            layoutType: 'grid',
            rows: [{
                rowOrder: (editPage.PageSections || []).length + 1,
                columns: [{
                    colOrder: 1,
                    width: 12,
                    contentType: 'text',
                    tag: `section-${(editPage.PageSections || []).length + 1}`
                }]
            }]
        };

        setEditPage({
            ...editPage,
            PageSections: [...(editPage.PageSections || []), newSection]
        });
    };

    const addEditColumn = (sectionIndex, rowIndex = 0) => {
        if (!editPage || !editPage.PageSections) return;

        const updatedSections = [...editPage.PageSections];
        const section = updatedSections[sectionIndex];

        // Ensure section and rows exist
        if (!section) return;
        if (!section.rows) section.rows = [];
        if (!section.rows[rowIndex]) section.rows[rowIndex] = { columns: [] };

        const row = section.rows[rowIndex];
        if (!row.columns) row.columns = [];

        row.columns.push({
            colOrder: row.columns.length + 1,
            width: 6,
            contentType: 'text',
            tag: `column-${row.columns.length + 1}`
        });

        setEditPage({
            ...editPage,
            PageSections: updatedSections
        });
    };

    const updateEditSection = (sectionIndex, field, value) => {
        if (!editPage || !editPage.PageSections) return;

        const updatedSections = [...editPage.PageSections];
        if (updatedSections[sectionIndex]) {
            updatedSections[sectionIndex][field] = value;
            setEditPage({
                ...editPage,
                PageSections: updatedSections
            });
        }
    };

    const deleteSection = (sectionIndex) => {
        if (!editPage || !editPage.PageSections) return;

        // Create a new array without the deleted section
        const updatedSections = editPage.PageSections.filter((_, index) => index !== sectionIndex);

        // Update the section orders
        const reorderedSections = updatedSections.map((section, index) => ({
            ...section,
            rows: (section.rows || []).map(row => ({
                ...row,
                rowOrder: index + 1
            }))
        }));

        setEditPage({
            ...editPage,
            PageSections: reorderedSections
        });
    };





    // Delete page
    const deletePage = async (pageId) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                await api.delete(`/layout/${pageId}`);
                showAlert('Page deleted successfully!', 'success');
                fetchPages();
                if (selectedPage && selectedPage.id === pageId) {
                    setSelectedPage(null);
                }
            } catch (error) {
                console.error('Error deleting page:', error);
                showAlert(error.response?.data?.message || 'Error deleting page', 'danger');
            }
        }
    };




    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = '/login';
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchPages();
        }
    }, [isLoggedIn]);

    if (loading) {
        return (
            <Container fluid className="py-4 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 custom-font-initial">
            {alert.show && (
                <Alert variant={alert.type} className="mb-3">
                    {alert.message}
                </Alert>
            )}

            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Pages</h5>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowCreateModal(true)}
                            >
                                + New Page
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {!Array.isArray(pages) || pages.length === 0 ? (
                                <p className="text-muted">No pages created yet.</p>
                            ) : (
                                <div className="list-group">
                                    {pages.map(page => (
                                        <div
                                            key={page.id}
                                            className={`list-group-item list-group-item-action ${selectedPage?.id === page.id ? 'active' : ''}`}
                                            onClick={() => fetchPageLayout(page.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{page.name}</span>
                                                <div>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            fetchPageForEdit(page.id);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deletePage(page.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    {selectedPage ? (
                        <Card>
                            <Card.Header>
                                <h4>Layout: {selectedPage.name}</h4>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="preview">
                                    <Nav variant="tabs" className="mb-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="preview">Preview</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="json">JSON Data</Nav.Link>
                                        </Nav.Item>
                                    </Nav>

                                    <Tab.Content>
                                        <Tab.Pane eventKey="preview">
                                            {selectedPage.PageSections?.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="border rounded p-3 mb-3">
                                                    <h6>Section {sectionIndex + 1} ({section.layoutType})</h6>
                                                    {section.Rows?.map((row, rowIndex) => (
                                                        <Row key={rowIndex} className="mb-2">
                                                            {row.Columns?.map((column, colIndex) => (
                                                                <Col key={colIndex} md={column.width}>
                                                                    <div className="border p-2 bg-light">
                                                                        <small className="text-muted">
                                                                            Column {column.colOrder}<br />
                                                                            Width: {column.width}<br />
                                                                            Type: {column.contentType}<br />
                                                                            Tag: {column.tag}
                                                                        </small>
                                                                    </div>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    ))}
                                                </div>
                                            ))}
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="json">
                                            <pre className="bg-dark text-light p-3 rounded">
                                                {JSON.stringify(selectedPage, null, 2)}
                                            </pre>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card>
                            <Card.Body className="text-center text-muted py-5">
                                <h5>Select a page to view its layout</h5>
                                <p>Or create a new page to get started</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>


            {/* Create Page Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" className='custom-font-initial'>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter page name (e.g., Homepage, About)"
                                value={newPage.name}
                                onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Sections</h6>
                            <Button variant="outline-primary" size="sm" onClick={addCreateSection}>
                                + Add Section
                            </Button>
                        </div>

                        {newPage.sections.map((section, sectionIndex) => (
                            <Card key={sectionIndex} className="mb-3">
                                <Card.Header>
                                    <Form.Group>
                                        <Form.Label>Layout Type</Form.Label>
                                        <Form.Select
                                            value={section.layoutType}
                                            onChange={(e) => {
                                                const updatedSections = [...newPage.sections];
                                                updatedSections[sectionIndex].layoutType = e.target.value;
                                                setNewPage({ ...newPage, sections: updatedSections });
                                            }}
                                        >
                                            <option value="grid">Grid</option>
                                            <option value="flex">Flex</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Card.Header>
                                <Card.Body>
                                    {section.rows.map((row, rowIndex) => (
                                        <div key={rowIndex}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="mb-0">Columns</h6>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => addCreateColumn(sectionIndex)}
                                                >
                                                    + Add Column
                                                </Button>
                                            </div>

                                            {row.columns.map((column, colIndex) => (
                                                <Row key={colIndex} className="mb-2">
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label>Content Type</Form.Label>
                                                            <Form.Select
                                                                value={column.contentType}
                                                                onChange={(e) => {
                                                                    const updatedSections = [...newPage.sections];
                                                                    updatedSections[sectionIndex].rows[rowIndex].columns[colIndex].contentType = e.target.value;
                                                                    setNewPage({ ...newPage, sections: updatedSections });
                                                                }}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="news">News</option>
                                                                <option value="image">Image</option>
                                                                <option value="video">Video</option>
                                                                <option value="ad">Advertisement</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label>Width (1-12)</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                min="1"
                                                                max="12"
                                                                value={column.width}
                                                                onChange={(e) => {
                                                                    const updatedSections = [...newPage.sections];
                                                                    updatedSections[sectionIndex].rows[rowIndex].columns[colIndex].width = parseInt(e.target.value);
                                                                    setNewPage({ ...newPage, sections: updatedSections });
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label>Tag</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="e.g., sports, tech"
                                                                value={column.tag}
                                                                onChange={(e) => {
                                                                    const updatedSections = [...newPage.sections];
                                                                    updatedSections[sectionIndex].rows[rowIndex].columns[colIndex].tag = e.target.value;
                                                                    setNewPage({ ...newPage, sections: updatedSections });
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createPage}>
                        Create Page
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Page Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" className='custom-font-initial'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Page: {editPage?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editPage?.name || ''}
                                onChange={(e) => setEditPage({ ...editPage, name: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Sections</h5>
                            <Button variant="outline-primary" size="sm" onClick={addEditSection}>
                                + Add Section
                            </Button>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={editPage?.PageSections?.map(section => section.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {editPage?.PageSections?.map((section, sectionIndex) => (
                                    <SortableSection
                                        key={section.id}
                                        section={section}
                                        sectionIndex={sectionIndex}
                                        onDelete={deleteSection}
                                        onUpdate={updateEditSection}
                                        onAddColumn={addEditColumn}
                                        editPage={editPage}
                                        setEditPage={setEditPage}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updatePage}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PageLayoutDashboard;