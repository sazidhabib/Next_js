import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Accordion, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";

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

            // Show SEO fields if any meta data exists
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
    }, [editMenu, setValue, reset]);

    // Auto-calculate level based on parent selection
    useEffect(() => {
        if (watchParentId) {
            const parentMenu = parentMenus.find(menu => menu.id == watchParentId);
            if (parentMenu) {
                setValue("level", parentMenu.level + 1);
            }
        } else {
            setValue("level", 0);
        }
    }, [watchParentId, parentMenus, setValue]);

    const handleFormSubmit = (data) => {
        // Convert empty strings to null for optional fields
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
        <Modal show={show} onHide={onHide} centered size="lg" className="custom-font-initial">
            <Modal.Header closeButton>
                <Modal.Title>{editMenu ? "Edit" : "Add"} Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Menu Name *</Form.Label>
                                <Form.Control
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Minimum 2 characters"
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Maximum 100 characters"
                                        }
                                    })}
                                    isInvalid={!!errors.name}
                                    onChange={handleNameChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Path *</Form.Label>
                                <Form.Control
                                    {...register("path", {
                                        required: "Path is required",
                                        pattern: {
                                            value: /^[a-z0-9-/]+$/,
                                            message: "Only lowercase letters, numbers, hyphens, and forward slashes"
                                        }
                                    })}
                                    isInvalid={!!errors.path}
                                />
                                <Form.Text className="text-muted">
                                    Use lowercase with hyphens, e.g., "about-us" or "products/electronics"
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.path?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Order *</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register("order", {
                                        required: "Order is required",
                                        min: {
                                            value: 1,
                                            message: "Minimum order is 1"
                                        },
                                        max: {
                                            value: 999,
                                            message: "Maximum order is 999"
                                        }
                                    })}
                                    isInvalid={!!errors.order}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.order?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Parent Menu</Form.Label>
                                <Form.Select
                                    {...register("parentId")}
                                >
                                    <option value="">— No Parent (Top Level) —</option>
                                    {parentMenus.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.name} {menu.level > 0 && `(Level ${menu.level})`}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Select parent for sub-menu
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register("level")}
                                    disabled
                                />
                                <Form.Text className="text-muted">
                                    Auto-calculated from parent
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="isActive"
                            label="Active Menu"
                            {...register("isActive")}
                            defaultChecked={true}
                        />
                    </Form.Group>

                    {/* SEO Fields Accordion */}
                    <Accordion defaultActiveKey={showSeoFields ? "0" : null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div className="d-flex align-items-center">
                                    <span>SEO Meta Fields</span>
                                    {hasSeoData && (
                                        <Badge bg="info" className="ms-2">
                                            Has Data
                                        </Badge>
                                    )}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Meta Title</Form.Label>
                                            <Form.Control
                                                {...register("metaTitle", {
                                                    maxLength: {
                                                        value: 255,
                                                        message: "Maximum 255 characters"
                                                    }
                                                })}
                                                isInvalid={!!errors.metaTitle}
                                                placeholder="Optional meta title for SEO"
                                            />
                                            <Form.Text className="text-muted">
                                                {watchMetaTitle?.length || 0}/255 characters
                                            </Form.Text>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.metaTitle?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...register("metaDescription", {
                                            maxLength: {
                                                value: 500,
                                                message: "Maximum 500 characters"
                                            }
                                        })}
                                        isInvalid={!!errors.metaDescription}
                                        placeholder="Optional meta description for SEO"
                                    />
                                    <Form.Text className="text-muted">
                                        {watchMetaDescription?.length || 0}/500 characters
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.metaDescription?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Keywords</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        {...register("metaKeywords", {
                                            maxLength: {
                                                value: 500,
                                                message: "Maximum 500 characters"
                                            }
                                        })}
                                        isInvalid={!!errors.metaKeywords}
                                        placeholder="Optional meta keywords for SEO (comma separated)"
                                    />
                                    <Form.Text className="text-muted">
                                        {watchMetaKeywords?.length || 0}/500 characters
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.metaKeywords?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editMenu ? "Update Menu" : "Create Menu"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MenuFormModal;