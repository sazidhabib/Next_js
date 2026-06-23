import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

const SectionFormModal = ({ show, onHide, onSubmit, section, sectionTypes }) => {
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const IMG_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`

    useEffect(() => {
        if (section) {
            setType(section.type);
            setTitle(section.title || "");
            setDescription(section.description || "");
            setPreview(section.imageUrl ? `${IMG_URL}${section.imageUrl.replace(/^\/+/, '')}` : '');
        } else {
            resetForm();
        }
    }, [section, show]);

    const resetForm = () => {
        setType("");
        setTitle("");
        setDescription("");
        setImage(null);
        setPreview("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            // If no file selected but we have existing image, keep it
            if (section?.imageUrl) {
                setPreview(`${IMG_URL}${section.imageUrl.replace(/^\/+/, '')}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                type,
                title,
                description,
                image: image || (section?.imageUrl ? section.imageUrl : null)
            });
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" className="custom-font-initial">
            <Modal.Header closeButton>
                <Modal.Title>
                    {section?._id ? "Edit" : "Create"} {sectionTypes.find(st => st.type === type)?.name || "Section"}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Section Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={!!section?._id}
                            required
                        >
                            <option value="">Select section type</option>
                            {sectionTypes.map((st) => (
                                <option key={st.type} value={st.type}>
                                    {st.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {(preview || section?.imageUrl) && (
                            <div className="mt-2">
                                <img
                                    src={preview || `${IMG_URL}${section.imageUrl.replace(/^\/+/, '')}`}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                                />
                            </div>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : "Save"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SectionFormModal;