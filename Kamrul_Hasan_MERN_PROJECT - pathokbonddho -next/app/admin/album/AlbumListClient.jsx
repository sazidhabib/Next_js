'use client';

import React, { useState } from 'react';
import { Table, Form, Button, Card, Spinner, Pagination, Modal, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from "@/app/lib/api";

const AlbumListClient = ({ initialAlbums, initialTotalPages, isAdmin }) => {
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editAlbum, setEditAlbum] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
    const [formData, setFormData] = useState({ name: '', status: 'active' });

    const fetchAlbums = async (targetPage = page) => {
        setLoading(true);
        try {
            const res = await api.get('/albums', { params: { page: targetPage } });
            const data = res.data.albums || (Array.isArray(res.data) ? res.data : []);
            const totalP = res.data.totalPages || 1;
            setAlbums(data);
            setTotalPages(totalP);
        } catch (err) {
            toast.error("Failed to fetch albums");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchAlbums(newPage);
    };

    const handleShowModal = (album = null) => {
        if (album) {
            setEditAlbum(album);
            setFormData({ name: album.name, status: album.status });
        } else {
            setEditAlbum(null);
            setFormData({ name: '', status: 'active' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.trim().length < 2) {
            toast.warning("Name too short");
            return;
        }

        try {
            if (editAlbum) {
                await api.patch(`/albums/${editAlbum._id}`, formData);
                toast.success("Album updated");
            } else {
                await api.post('/albums', formData);
                toast.success("Album created");
            }
            setShowModal(false);
            fetchAlbums();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/albums/${deleteId}`);
            toast.success("Album deleted");
            fetchAlbums();
        } catch (err) { toast.error("Delete failed"); }
        finally { setShowConfirm(false); setDeleteId(null); }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">📁 Photo Albums</h4>
                <Button variant="primary" onClick={() => handleShowModal()} className="shadow-sm">
                    <i className="fas fa-plus me-2"></i>Create Album
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <div className="card-body p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="table-dark">
                            <tr key="header"><th>#</th><th>Album Name</th><th>Status</th><th className="text-center">Actions</th></tr>
                        </thead>
                        <tbody>
                            {(() => {
                                if (loading) {
                                    return <tr key="loading"><td colSpan="4" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>;
                                }
                                if (albums.length === 0) {
                                    return <tr key="empty"><td colSpan="4" className="text-center py-5 text-muted">No albums discovered.</td></tr>;
                                }
                                return albums.map((album, i) => (
                                    <tr key={album._id || `album-${i}`} className="align-middle">
                                        <td>{(page - 1) * 10 + i + 1}</td>
                                        <td className="fw-bold">{album.name}</td>
                                        <td><Badge bg={album.status === 'active' ? 'success' : 'secondary'}>{album.status}</Badge></td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(album)}>Edit</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => { setDeleteId(album._id); setShowConfirm(true); }}>Del</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </Table>
                </div>
            </Card>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i} active={i + 1 === page} onClick={() => handlePageChange(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                </Pagination>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">{editAlbum ? 'Edit' : 'Create'} Album</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Album Name</Form.Label>
                            <Form.Control value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Political Events 2024" />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label className="fw-bold">Visibility Status</Form.Label>
                            <Form.Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="active">Active (Visible)</option>
                                <option value="inactive">Inactive (Hidden)</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-top-0 pt-0">
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="px-4">Save Album</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ConfirmationModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                body="Are you sure you want to delete this album? This will not delete the photos inside, but they will no longer be grouped."
            />
        </div>
    );
};

const ConfirmationModal = ({ show, onHide, onConfirm, body }) => (
    <Modal show={show} onHide={onHide} centered size="sm">
        <Modal.Header closeButton><Modal.Title className="h6 mb-0">Confirmation</Modal.Title></Modal.Header>
        <Modal.Body className="small">{body}</Modal.Body>
        <Modal.Footer className="p-2">
            <Button variant="light" size="sm" onClick={onHide}>Discard</Button>
            <Button variant="danger" size="sm" onClick={onConfirm}>Confirm Delete</Button>
        </Modal.Footer>
    </Modal>
);

export default AlbumListClient;
