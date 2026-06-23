import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

const HeroSectionFormModal = ({ show, onHide, onSubmit, editData }) => {
    const [title, setTitle] = useState("");
    const [lines, setLines] = useState(["", "", ""]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const IMG_URL = `${import.meta.env.VITE_API_BASE_URL}/`;

    useEffect(() => {
        if (editData) {
            setTitle(editData.title || "");
            setLines(editData.lines || ["", "", ""]);
            // Set preview with full URL if imageUrl exists
            setPreview(editData.imageUrl ? `${IMG_URL}${editData.imageUrl.replace(/^\/+/, "")}` : "");
            setImage(null); // Reset image state when editing
        } else {
            resetForm();
        }
    }, [editData, show]); // Added show to dependencies

    const resetForm = () => {
        setTitle("");
        setLines(["", "", ""]);
        setImage(null);
        setPreview("");
    };

    const handleLineChange = (index, value) => {
        const newLines = [...lines];
        newLines[index] = value;
        setLines(newLines);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            // If no file selected but we have existing image, keep it
            if (editData?.imageUrl) {
                setPreview(`${IMG_URL}${editData.imageUrl.replace(/^\/+/, "")}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                title,
                lines,
                image: image || undefined // Send undefined if no new image
            });
            onHide(); // Close modal on success
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} className="custom-font-initial" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{editData ? "Edit" : "Add"} Hero Section</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {lines.map((line, index) => (
                        <Form.Group key={index} className="mb-3">
                            <Form.Label>Line {index + 1}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={line}
                                onChange={(e) => handleLineChange(index, e.target.value)}
                                required
                            />
                        </Form.Group>
                    ))}

                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {(preview || editData?.imageUrl) && (
                            <div className="mt-2">
                                <img
                                    src={preview || `${IMG_URL}${editData.imageUrl.replace(/^\/+/, "")}`}
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

export default HeroSectionFormModal;