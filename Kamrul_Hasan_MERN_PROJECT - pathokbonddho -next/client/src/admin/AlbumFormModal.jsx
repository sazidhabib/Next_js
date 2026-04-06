// AlbumFormModal.jsx
import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const AlbumFormModal = ({ show, onHide, onSubmit, editAlbum }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (editAlbum) {
            setValue("name", editAlbum.name);  // Changed from "title" to "name" to match your backend
            setValue("status", editAlbum.status);
        } else {
            reset();
        }
    }, [editAlbum, setValue, reset]);

    return (
        <Modal show={show} onHide={onHide} centered className="custom-font-initial">
            <Modal.Header closeButton>
                <Modal.Title>{editAlbum ? "Edit" : "Add"} Album</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Album Name</Form.Label>
                        <Form.Control
                            {...register("name", {
                                required: "Album name is required",
                                minLength: {
                                    value: 3,
                                    message: "Album name must be at least 3 characters"
                                }
                            })}
                            isInvalid={!!errors.name}
                        />
                        {errors.name && (
                            <Form.Control.Feedback type="invalid">
                                {errors.name.message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            {...register("status", { required: "Status is required" })}
                            isInvalid={!!errors.status}
                        >
                            <option value="">Select status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                        {errors.status && (
                            <Form.Control.Feedback type="invalid">
                                {errors.status.message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editAlbum ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AlbumFormModal;