'use client';

import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Badge, Dropdown, Form, Modal, Row, Col, Accordion, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "@/app/lib/api";

const MenuFormModal = ({ show, onHide, onSubmit, editMenu, parentMenus }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm();

    const [showSeoFields, setShowSeoFields] = useState(false);

    const watchParentId = watch("parentId");
    const watchMetaTitle = watch("metaTitle");
    const watchMetaDescription = watch("metaDescription");
    const watchMetaKeywords = watch("metaKeywords");

    useEffect(() => {
        if (editMenu) {
            setValue("name", editMenu.name);
            setValue("path", editMenu.path);
            setValue("order", editMenu.order);
            setValue("metaTitle", editMenu.metaTitle || "");
            setValue("metaDescription", editMenu.metaDescription || "");
            setValue("metaKeywords", editMenu.metaKeywords || "");
            setValue("parentId", editMenu.parentId || "");
            setValue("level", editMenu.level || 0);
            setValue("isActive", editMenu.isActive !== undefined ? editMenu.isActive : true);

            if (editMenu.metaTitle || editMenu.metaDescription || editMenu.metaKeywords) {
                setShowSeoFields(true);
            }
        } else {
            reset({
                name: "",
                path: "",
                order: 1,
                metaTitle: "",
                metaDescription: "",
                metaKeywords: "",
                parentId: "",
                level: 0,
                isActive: true
            });
            setShowSeoFields(false);
        }
    }, [editMenu, setValue, reset, show]);

    useEffect(() => {
        if (watchParentId) {
            const parentMenu = parentMenus.find(menu => menu.id == watchParentId);
            if (parentMenu) {
                setValue("level", (parentMenu.level || 0) + 1);
            }
        } else {
            setValue("level", 0);
        }
    }, [watchParentId, parentMenus, setValue]);

    const handleFormSubmit = (data) => {
        const submitData = {
            ...data,
            parentId: data.parentId || null,
            metaTitle: data.metaTitle || null,
            metaDescription: data.metaDescription || null,
            metaKeywords: data.metaKeywords || null,
            level: parseInt(data.level),
            order: parseInt(data.order),
            isActive: data.isActive === "true" || data.isActive === true
        };
        onSubmit(submitData);
    };

    const generatePathFromName = (name) => {
        if (!name) return "";
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        if (!editMenu && name) {
            const generatedPath = generatePathFromName(name);
            setValue("path", generatedPath);
        }
    };

    const hasSeoData = watchMetaTitle || watchMetaDescription || watchMetaKeywords;

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{editMenu ? "Edit" : "Add"} Menu Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Menu Name *</Form.Label>
                                <Form.Control
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: { value: 2, message: "Minimum 2 characters" }
                                    })}
                                    isInvalid={!!errors.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. World News"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Path *</Form.Label>
                                <Form.Control
                                    {...register("path", {
                                        required: "Path is required",
                                        pattern: {
                                            value: /^[a-z0-9-/]+$/,
                                            message: "Only lowercase letters, numbers, hyphens"
                                        }
                                    })}
                                    isInvalid={!!errors.path}
                                    placeholder="e.g. world-news"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.path?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Order *</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register("order", { required: "Order is required", min: 1 })}
                                    isInvalid={!!errors.order}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Parent Menu</Form.Label>
                                <Form.Select {...register("parentId")}>
                                    <option value="">— No Parent —</option>
                                    {parentMenus.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.name} {menu.level > 0 ? `(L${menu.level})` : ''}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Level</Form.Label>
                                <Form.Control type="number" {...register("level")} disabled className="bg-light" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Check
                            type="switch"
                            id="isActive-switch"
                            label="Active Menu"
                            {...register("isActive")}
                            className="fw-bold"
                        />
                    </Form.Group>

                    <div className="mb-4">
                        <Button 
                            variant="light" 
                            className="w-100 d-flex justify-content-between align-items-center border shadow-sm py-3"
                            onClick={() => setShowSeoFields(!showSeoFields)}
                            type="button"
                        >
                            <span className="fw-bold text-dark">
                                SEO Meta Configuration
                                {hasSeoData && <Badge bg="success" className="ms-3">Configured</Badge>}
                            </span>
                            <span className="text-muted">{showSeoFields ? '▼' : '▶'}</span>
                        </Button>
                        
                        {showSeoFields && (
                            <div className="border border-top-0 p-3 bg-light shadow-sm">
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Title</Form.Label>
                                    <Form.Control {...register("metaTitle")} placeholder="Default: Same as Name" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} {...register("metaDescription")} placeholder="Brief summary for search results" />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label>Meta Keywords</Form.Label>
                                    <Form.Control as="textarea" rows={2} {...register("metaKeywords")} placeholder="news, world, updates..." />
                                </Form.Group>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
                        <Button type="submit" variant="primary" className="px-4">
                            {editMenu ? "Update Menu" : "Create Menu"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const ConfirmationModal = ({ show, onHide, onConfirm, title = "Confirm", body = "Are you sure?" }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={onHide}>No</Button>
            <Button variant="danger" onClick={onConfirm} className="px-4">Yes, Delete</Button>
        </Modal.Footer>
    </Modal>
);

const MenuListClient = ({ initialMenus, initialParents, isAdmin }) => {
    const [menus, setMenus] = useState(initialMenus || []);
    const [parentMenus, setParentMenus] = useState(initialParents || []);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [viewFormat, setViewFormat] = useState('flat');
    const [activeOnly, setActiveOnly] = useState(false);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const params = { format: viewFormat, activeOnly };
            const res = await api.get('/menus', { params });
            setMenus(res.data.data || res.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error("Failed to fetch menus");
        } finally {
            setLoading(false);
        }
    };

    const fetchParentMenus = async () => {
        try {
            const res = await api.get('/menus/parents');
            setParentMenus(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        // Only fetch if we're changing filters after initial load
        if (loading === false) fetchMenus();
    }, [viewFormat, activeOnly]);

    const handleMenuSubmit = async (menuData) => {
        try {
            if (editMenu) {
                await api.patch(`/menus/${editMenu.id}`, menuData);
                toast.success("Menu updated");
            } else {
                await api.post('/menus', menuData);
                toast.success("Menu created");
            }
            setModalShow(false);
            setEditMenu(null);
            fetchMenus();
            fetchParentMenus();
        } catch (err) { toast.error(err.response?.data?.message || "Operation failed"); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/menus/${menuToDelete}`);
            toast.success("Menu deleted");
            setConfirmModalShow(false);
            setMenuToDelete(null);
            fetchMenus();
            fetchParentMenus();
        } catch (err) { toast.error("Delete failed"); }
    };

    const toggleMenuStatus = async (menuId, currentStatus) => {
        try {
            await api.patch(`/menus/${menuId}`, { isActive: !currentStatus });
            fetchMenus();
        } catch (err) { toast.error("Status update failed"); }
    };

    const renderMenuTree = (menuList, level = 0) => {
        return menuList.map((menu) => (
            <React.Fragment key={menu.id}>
                <tr className="align-middle">
                    <td>
                        <div style={{ paddingLeft: `${level * 25}px` }}>
                            {level > 0 && <span className="text-muted me-2">↳</span>}
                            <span className={level === 0 ? "fw-bold" : ""}>{menu.name}</span>
                        </div>
                    </td>
                    <td><code className="text-primary">{menu.path}</code></td>
                    <td><Badge bg="light" text="dark" className="border">{menu.order}</Badge></td>
                    <td><Badge bg={menu.isActive ? "success" : "secondary"}>{menu.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td><small className="text-muted">Level {menu.level}</small></td>
                    <td className="text-center">
                        <div className="btn-group">
                            <Button variant="outline-primary" size="sm" onClick={() => { setEditMenu(menu); setModalShow(true); }}>Edit</Button>
                            <Button variant={menu.isActive ? "outline-warning" : "outline-success"} size="sm" onClick={() => toggleMenuStatus(menu.id, menu.isActive)}>
                                <i className={`fas fa-${menu.isActive ? 'pause' : 'play'}`}></i>
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => { setMenuToDelete(menu.id); setConfirmModalShow(true); }}>Del</Button>
                        </div>
                    </td>
                </tr>
                {menu.children && menu.children.length > 0 && renderMenuTree(menu.children, level + 1)}
            </React.Fragment>
        ));
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">📂 Menu Architecture</h4>
                <Button variant="primary" onClick={() => { setEditMenu(null); setModalShow(true); }} className="shadow-sm">
                    <i className="fas fa-plus me-2"></i>New Menu Item
                </Button>
            </div>

            <Card className="mb-4 shadow-sm border-0 bg-light">
                <Card.Body className="py-2">
                    <Row className="align-items-center">
                        <Col md="auto">
                            <div className="d-flex gap-3 align-items-center py-2">
                                <span className="fw-bold small text-muted text-uppercase">View:</span>
                                <div className="btn-group btn-group-sm">
                                    <Button variant={viewFormat === 'flat' ? 'primary' : 'outline-primary'} onClick={() => setViewFormat('flat')}>Flat</Button>
                                    <Button variant={viewFormat === 'tree' ? 'primary' : 'outline-primary'} onClick={() => setViewFormat('tree')}>Hierarchy</Button>
                                </div>
                                <Form.Check
                                    type="switch"
                                    id="active-toggle"
                                    label="Active Only"
                                    checked={activeOnly}
                                    onChange={(e) => setActiveOnly(e.target.checked)}
                                    className="ms-3"
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Menu Item</th>
                                <th>Path / Route</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th>Level</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">Loading structures...</p></td></tr>
                            ) : (
                                viewFormat === 'tree' ? renderMenuTree(menus) : menus.map((menu) => (
                                    <tr key={menu.id} className="align-middle">
                                        <td className="fw-bold">{menu.name}</td>
                                        <td><code className="text-primary">{menu.path}</code></td>
                                        <td><Badge bg="light" text="dark" className="border">{menu.order}</Badge></td>
                                        <td><Badge bg={menu.isActive ? "success" : "secondary"}>{menu.isActive ? "Active" : "Inactive"}</Badge></td>
                                        <td><small className="text-muted">Level {menu.level}</small></td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <Button variant="outline-primary" size="sm" onClick={() => { setEditMenu(menu); setModalShow(true); }}>Edit</Button>
                                                <Button variant={menu.isActive ? "outline-warning" : "outline-success"} size="sm" onClick={() => toggleMenuStatus(menu.id, menu.isActive)}>
                                                    {menu.isActive ? "Pause" : "Play"}
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => { setMenuToDelete(menu.id); setConfirmModalShow(true); }}>Del</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!loading && menus.length === 0 && (
                                <tr><td colSpan="6" className="text-center py-5 text-muted">No menu items found. Start by adding one!</td></tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <MenuFormModal
                show={modalShow}
                onHide={() => { setModalShow(false); setEditMenu(null); }}
                onSubmit={handleMenuSubmit}
                editMenu={editMenu}
                parentMenus={parentMenus}
            />

            <ConfirmationModal
                show={confirmModalShow}
                onHide={() => { setConfirmModalShow(false); setMenuToDelete(null); }}
                onConfirm={handleDelete}
                body="Are you sure you want to delete this menu? Children items may also be affected."
            />
        </div>
    );
};

export default MenuListClient;
