import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const PhotoFormModal = ({ show, onHide, onSubmit, editPhoto }) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    const [albums, setAlbums] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);  // Always as array
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch albums when modal opens
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/albums?status=active`);
                setAlbums(res.data);
            } catch (err) {
                console.error("Failed to load albums:", err);
            }
        };

        if (show) {
            fetchAlbums();
            if (editPhoto) {
                setValue("albumId", editPhoto.album?.id || "");
                setValue("status", editPhoto.status || "active");
                setValue("caption", editPhoto.caption || "");
                if (editPhoto.imageUrl) {
                    setImagePreview([`${import.meta.env.VITE_API_BASE_URL}/${editPhoto.imageUrl}`]);
                } else {
                    setImagePreview([]);
                }
            } else {
                reset();
                setImagePreview([]);
            }
        } else {
            reset();
            clearPreviews();  // Clear previews when modal closes
        }
    }, [show, editPhoto, setValue, reset]);

    // Cleanup preview URLs from memory
    const clearPreviews = () => {
        imagePreview.forEach((url) => {
            if (url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        });
        setImagePreview([]);
    };

    const handleImageChange = (e) => {
        clearPreviews();  // Always clear old previews first
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreview(previews);
        }
    };

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('albumId', data.albumId);
            formData.append('status', data.status);
            formData.append('caption', data.caption?.trim() || '');

            if (data.images?.length > 0) {
                for (const file of data.images) {
                    formData.append('images', file);
                }
            }

            await onSubmit(formData);
            onHide();
        } finally {
            setIsSubmitting(false);
            clearPreviews();  // Clean previews after submit
        }
    };

    return (
        <Modal show={show} onHide={() => { onHide(); clearPreviews(); }} centered className="custom-font-initial">
            <Modal.Header closeButton>
                <Modal.Title>{editPhoto ? "Edit" : "Add"} Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Form.Group controlId="albumId" className="mb-3">
                        <Form.Label>Album</Form.Label>
                        <Form.Select {...register("albumId", { required: true })}>
                            <option value="">Select Album</option>
                            {albums.map((album) => (
                                <option key={album.id} value={album.id}>{album.name}</option>
                            ))}
                        </Form.Select>
                        {errors.albumId && <div className="text-danger">Album is required</div>}
                    </Form.Group>

                    <Form.Group controlId="images" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" multiple {...register("images")} onChange={handleImageChange} />
                    </Form.Group>

                    {imagePreview.length > 0 && (
                        <div className="mb-3">
                            <strong>Preview:</strong>
                            <div className="d-flex flex-wrap">
                                {imagePreview.map((src, idx) => (
                                    <img key={idx} src={src} alt="preview" style={{ width: "100px", height: "80px", objectFit: "cover", marginRight: "5px" }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <Form.Group controlId="status" className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register("status", { required: true })}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="caption" className="mb-3">
                        <Form.Label>Caption</Form.Label>
                        <Form.Control type="text" {...register("caption")} />
                    </Form.Group>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : (editPhoto ? "Update" : "Add")}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PhotoFormModal;
